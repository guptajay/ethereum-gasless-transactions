"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function replaceErrors(key, value) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries())
        };
    }
    else if (value instanceof Error) {
        const error = {};
        // remove "circular referenced" objects we don't really want to log...
        Object.getOwnPropertyNames(value).filter(e => !['request', 'response'].includes(e)).forEach(function (key) {
            error[key] =
                // @ts-ignore
                value[key];
        });
        return error;
    }
    return value;
}
exports.replaceErrors = replaceErrors;
//# sourceMappingURL=ErrorReplacerJSON.js.map