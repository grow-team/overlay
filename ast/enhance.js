module.exports = function enhance(raw, parent, module, code) {
    if (!raw)
        return;
    if ('length' in raw) {
        for (var i = 0; i < raw.length; i += 1) {
            enhanceNode(raw[i], parent, module, code);
        }
        return;
    }
    var rawNode = raw;
    // with e.g. shorthand properties, key and value are
    // the same node. We don't want to enhance an object twice
    if (rawNode.__enhanced)
        return;
    rawNode.__enhanced = true;
    if (!keys$1[rawNode.type]) {
        keys$1[rawNode.type] = Object.keys(rawNode).filter(function (key) { return typeof rawNode[key] === 'object'; });
    }
    rawNode.parent = parent;
    rawNode.module = module;
    rawNode.keys = keys$1[rawNode.type];
    code.addSourcemapLocation(rawNode.start);
    code.addSourcemapLocation(rawNode.end);
    for (var _i = 0, _a = keys$1[rawNode.type]; _i < _a.length; _i++) {
        var key = _a[_i];
        enhanceNode(rawNode[key], rawNode, module, code);
    }
    var type = nodes[rawNode.type] || UnknownNode;
    rawNode.__proto__ = type.prototype;
}