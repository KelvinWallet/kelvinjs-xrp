"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var Networks;
(function (Networks) {
    Networks["MAINNET"] = "mainnet";
    Networks["TESTNET"] = "testnet";
})(Networks = exports.Networks || (exports.Networks = {}));
exports.supportedNetworks = (_a = {},
    _a[Networks.MAINNET] = {
        apiUrl: 'wss://s1.ripple.com',
        addressUrl: 'https://xrpscan.com/account/',
        txUrl: 'https://xrpscan.com/tx/',
    },
    _a[Networks.TESTNET] = {
        apiUrl: 'wss://s.altnet.rippletest.net:51233',
        addressUrl: 'https://test.bithomp.com/explorer/',
        txUrl: 'https://test.bithomp.com/explorer/',
    },
    _a);
