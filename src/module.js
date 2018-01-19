const acorn = require('acorn');
const MagicString = require('magic-string');
module.exports = class Module{
    constructor( opts ){
        this.id = opts.id;
        this.sources = []; //所有import，资源位置
        this.resolvedIds = {}; //import 和具体资源位置的对应
        this.dependencies = []; //所有依赖的Module实例
        this.bundle = opts.bundle;
        this.importer = opts.importer;
        this.code = opts.code;
        this.analyse();
        this.magicString = new MagicString(this.code, {
			filename: null,
			indentExclusionRanges: []
		});
    }

    analyse (){
        this.ast = acorn.parse(this.code, {
			ecmaVersion: 8,
			sourceType: 'module',
			preserveParens: false
        })

                
        this.addImport();
    }
    addImport (){
        for( const node of this.ast.body ){
            if( node.type === 'ImportDeclaration' ){
                this.sources.push( node.source.value );
            }
        }
    }

	linkDependencies () {
		this.sources.forEach(source => {
			const id = this.resolvedIds[source];
			if (id) {
				const module = this.bundle.moduleById.get(id);
				this.dependencies.push(module);
			}
		});
    }
    
    render() {
        const magicString = this.magicString.clone();
        for (const node of this.ast.body) {
            //node.render(magicString);
        }
        return magicString.trim();
    }
}