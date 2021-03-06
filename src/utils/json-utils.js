"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function appendPropertyInAstObject(recorder, node, propertyName, value, indent) {
    const indentStr = _buildIndent(indent);
    if (node.properties.length > 0) {
        // Insert comma.
        const last = node.properties[node.properties.length - 1];
        recorder.insertRight(last.start.offset + last.text.replace(/\s+$/, '').length, ',');
    }
    recorder.insertLeft(node.end.offset - 1, '  '
        + `"${propertyName}": ${JSON.stringify(value, null, 2).replace(/\n/g, indentStr)}`
        + indentStr.slice(0, -2));
}
exports.appendPropertyInAstObject = appendPropertyInAstObject;
function insertPropertyInAstObjectInOrder(recorder, node, propertyName, value, indent) {
    if (node.properties.length === 0) {
        appendPropertyInAstObject(recorder, node, propertyName, value, indent);
        return;
    }
    // Find insertion info.
    let insertAfterProp = null;
    let prev = null;
    let isLastProp = false;
    const last = node.properties[node.properties.length - 1];
    for (const prop of node.properties) {
        if (prop.key.value > propertyName) {
            if (prev) {
                insertAfterProp = prev;
            }
            break;
        }
        if (prop === last) {
            isLastProp = true;
            insertAfterProp = last;
        }
        prev = prop;
    }
    if (isLastProp) {
        appendPropertyInAstObject(recorder, node, propertyName, value, indent);
        return;
    }
    const indentStr = _buildIndent(indent);
    const insertIndex = insertAfterProp === null
        ? node.start.offset + 1
        : insertAfterProp.end.offset + 1;
    recorder.insertRight(insertIndex, indentStr
        + `"${propertyName}": ${JSON.stringify(value, null, 2).replace(/\n/g, indentStr)}`
        + ',');
}
exports.insertPropertyInAstObjectInOrder = insertPropertyInAstObjectInOrder;
function appendValueInAstArray(recorder, node, value, indent = 4) {
    const indentStr = _buildIndent(indent);
    if (node.elements.length > 0) {
        // Insert comma.
        const last = node.elements[node.elements.length - 1];
        recorder.insertRight(last.start.offset + last.text.replace(/\s+$/, '').length, ',');
    }
    recorder.insertLeft(node.end.offset - 1, '  '
        + JSON.stringify(value, null, 2).replace(/\n/g, indentStr)
        + indentStr.slice(0, -2));
}
exports.appendValueInAstArray = appendValueInAstArray;
function findPropertyInAstObject(node, propertyName) {
    let maybeNode = null;
    for (const property of node.properties) {
        if (property.key.value == propertyName) {
            maybeNode = property.value;
        }
    }
    return maybeNode;
}
exports.findPropertyInAstObject = findPropertyInAstObject;
function _buildIndent(count) {
    return '\n' + new Array(count + 1).join(' ');
}
//# sourceMappingURL=json-utils.js.map