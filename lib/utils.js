"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_js_1 = __importDefault(require("bignumber.js"));
function getAccountPath(index) {
    return [0x80000000 + index, 0, 0];
}
exports.getAccountPath = getAccountPath;
function toSafeBuffer(value) {
    var result;
    if (typeof value === 'string') {
        if (!/^(0x)?([0-9a-fA-F]+)?$/.test(value)) {
            throw Error("invalid string: \"" + value + "\"");
        }
        if (/^[0-9]+$/.test(value)) {
            var bigNumber = new bignumber_js_1.default(value);
            result = hexdecode(bigNumber.toString(16));
        }
        else {
            result = hexdecode(value);
        }
    }
    else if (typeof value === 'number') {
        if (value < 0 || Math.floor(value) !== value) {
            throw Error("invalid number: " + value + ", only accept uint");
        }
        var byteLength = Math.max(1, Math.ceil(Math.log2(value) / 8));
        result = Buffer.alloc(byteLength);
        result.writeUIntBE(value, 0, byteLength);
    }
    else if (value instanceof Buffer) {
        result = value;
    }
    else if (value instanceof bignumber_js_1.default) {
        result = hexdecode(value.toString(16));
    }
    else if (typeof value === 'undefined') {
        result = Buffer.alloc(0);
    }
    else {
        throw Error("invalid type " + typeof value);
    }
    while (result[0] === 0) {
        result = result.slice(1);
    }
    return result;
}
exports.toSafeBuffer = toSafeBuffer;
function hexencode(arr, addHexPrefix) {
    if (addHexPrefix === void 0) { addHexPrefix = false; }
    if (!(arr instanceof Uint8Array || arr instanceof Array)) {
        throw new Error('input type error');
    }
    var uint8Array = new Uint8Array(arr);
    var buffer = Buffer.from(uint8Array);
    if (addHexPrefix) {
        return "0x" + buffer.toString('hex');
    }
    else {
        return buffer.toString('hex');
    }
}
exports.hexencode = hexencode;
function hexdecode(hexstring) {
    var str = hexstring;
    if (/^0x/.test(hexstring)) {
        str = hexstring.slice(2);
    }
    return Buffer.from(str, 'hex');
}
exports.hexdecode = hexdecode;
