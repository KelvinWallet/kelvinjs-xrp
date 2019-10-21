"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ArmadilloProtob = __importStar(require("kelvinjs-protob"));
var ripple_address_codec_1 = require("ripple-address-codec");
var ripple_binary_codec_1 = require("ripple-binary-codec");
var binary_1 = require("ripple-binary-codec/distrib/npm/binary");
var hash_prefixes_1 = require("ripple-binary-codec/distrib/npm/hash-prefixes");
var ripple_keypairs_1 = require("ripple-keypairs");
var ripple_lib_1 = require("ripple-lib");
var utils_1 = require("ripple-lib/dist/npm/common/utils");
var secp256k1_1 = __importDefault(require("secp256k1"));
var network_1 = require("./model/network");
var Utils = __importStar(require("./utils"));
function getSupportedNetworks() {
    return [network_1.Networks.MAINNET, network_1.Networks.TESTNET];
}
exports.getSupportedNetworks = getSupportedNetworks;
function getSupportedNetwork(network) {
    if (!getSupportedNetworks().includes(network)) {
        throw Error("invalid network: " + network);
    }
    return network_1.supportedNetworks[network];
}
exports.getSupportedNetwork = getSupportedNetwork;
function getFeeOptionUnit() {
    throw new Error('No fee options available');
}
exports.getFeeOptionUnit = getFeeOptionUnit;
function isValidFeeOption(network, feeOpt) {
    if (!getSupportedNetworks().includes(network)) {
        throw Error("invalid network: " + network);
    }
    throw new Error('No fee options available');
}
exports.isValidFeeOption = isValidFeeOption;
function isValidAddr(network, addr) {
    if (!getSupportedNetworks().includes(network)) {
        throw Error("invalid network: " + network);
    }
    try {
        var array = ripple_address_codec_1.decodeAccountID(addr);
        return array instanceof Buffer && array.length === 20;
    }
    catch (error) {
        return false;
    }
}
exports.isValidAddr = isValidAddr;
function isValidNormAmount(amount) {
    try {
        utils_1.xrpToDrops(amount);
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.isValidNormAmount = isValidNormAmount;
function convertNormAmountToBaseAmount(amount) {
    if (isValidNormAmount(amount)) {
        return utils_1.xrpToDrops(amount);
    }
    else {
        throw Error('invalid amount');
    }
}
exports.convertNormAmountToBaseAmount = convertNormAmountToBaseAmount;
function convertBaseAmountToNormAmount(amount) {
    try {
        return utils_1.dropsToXrp(amount);
    }
    catch (error) {
        throw Error('invalid amount');
    }
}
exports.convertBaseAmountToNormAmount = convertBaseAmountToNormAmount;
function getUrlForAddr(network, addr) {
    var xrpNetwork = getSupportedNetwork(network);
    return "" + xrpNetwork.addressUrl + addr;
}
exports.getUrlForAddr = getUrlForAddr;
function getUrlForTx(network, txid) {
    var xrpNetwork = getSupportedNetwork(network);
    return xrpNetwork.txUrl + "/tx/" + txid;
}
exports.getUrlForTx = getUrlForTx;
function encodePubkeyToAddr(network, pubkey) {
    if (!getSupportedNetworks().includes(network)) {
        throw Error("invalid network: " + network);
    }
    if (!/^04[0-9a-fA-F]{128}$/.test(pubkey)) {
        throw Error('invalid uncompressed public key');
    }
    var publicKey = Utils.hexdecode(pubkey);
    var compressed = secp256k1_1.default.publicKeyConvert(publicKey, true);
    var address = ripple_keypairs_1.deriveAddress(compressed.toString('hex').toUpperCase());
    return address;
}
exports.encodePubkeyToAddr = encodePubkeyToAddr;
function getFeeOptions(network) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new Error('No fee options available');
        });
    });
}
exports.getFeeOptions = getFeeOptions;
function getHistorySchema() {
    return [
        {
            key: 'type',
            format: 'string',
            label: 'Type',
        },
        {
            key: 'date',
            format: 'date',
            label: 'Date',
        },
        {
            key: 'txid',
            format: 'hash',
            label: 'TxHash',
        },
        {
            key: 'to',
            format: 'address',
            label: 'To',
        },
        {
            key: 'value',
            format: 'value',
            label: 'Value',
        },
        {
            key: 'fee',
            format: 'value',
            label: 'Fee',
        },
    ];
}
exports.getHistorySchema = getHistorySchema;
function submitTransaction(network, signedTx) {
    return __awaiter(this, void 0, void 0, function () {
        var xrpNetwork, ripple, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xrpNetwork = getSupportedNetwork(network);
                    ripple = new ripple_lib_1.RippleAPI({
                        server: xrpNetwork.apiUrl,
                    });
                    return [4 /*yield*/, ripple.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, ripple.submit(signedTx)];
                case 2:
                    response = (_a.sent());
                    return [4 /*yield*/, ripple.disconnect()];
                case 3:
                    _a.sent();
                    // console.log(response);
                    if (response.resultCode !== 'tesSUCCESS') {
                        throw new Error(response.resultCode + ": " + response.resultMessage);
                    }
                    return [2 /*return*/, response.tx_json.hash];
            }
        });
    });
}
exports.submitTransaction = submitTransaction;
function prepareCommandGetPubkey(network, accountIndex) {
    if (!getSupportedNetworks().includes(network)) {
        throw Error("invalid network: " + network);
    }
    var req = new ArmadilloProtob.Ripple.XrpCommand();
    var msg = new ArmadilloProtob.Ripple.XrpCommand.XrpGetPub();
    var pathList = Utils.getAccountPath(accountIndex);
    if (pathList.length !== 3) {
        throw Error('invalid path');
    }
    msg.setPathList(pathList);
    req.setGetPub(msg);
    return {
        commandId: ArmadilloProtob.RIPPLE_CMDID,
        payload: Buffer.from(req.serializeBinary()),
    };
}
exports.prepareCommandGetPubkey = prepareCommandGetPubkey;
function parsePubkeyResponse(walletRsp) {
    var response = ArmadilloProtob.Ripple.XrpResponse.deserializeBinary(walletRsp.payload);
    var data = response.getPk();
    if (!data) {
        throw Error('invalid wallet response');
    }
    var publicKey = Buffer.from(data.getPubkey_asU8());
    var uncompressed = secp256k1_1.default.publicKeyConvert(publicKey, false);
    return uncompressed.toString('hex');
}
exports.parsePubkeyResponse = parsePubkeyResponse;
function prepareCommandShowAddr(network, accountIndex) {
    if (!getSupportedNetworks().includes(network)) {
        throw Error("invalid network: " + network);
    }
    var req = new ArmadilloProtob.Ripple.XrpCommand();
    var msg = new ArmadilloProtob.Ripple.XrpCommand.XrpShowAddr();
    var pathList = Utils.getAccountPath(accountIndex);
    if (pathList.length !== 3) {
        throw Error('invalid path');
    }
    msg.setPathList(pathList);
    req.setShowAddr(msg);
    return {
        commandId: ArmadilloProtob.RIPPLE_CMDID,
        payload: Buffer.from(req.serializeBinary()),
    };
}
exports.prepareCommandShowAddr = prepareCommandShowAddr;
function getBalance(network, addr) {
    return __awaiter(this, void 0, void 0, function () {
        var xrpNetwork, ripple, balance, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xrpNetwork = getSupportedNetwork(network);
                    ripple = new ripple_lib_1.RippleAPI({
                        server: xrpNetwork.apiUrl,
                    });
                    return [4 /*yield*/, ripple.connect()];
                case 1:
                    _a.sent();
                    balance = '0';
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, 5, 7]);
                    return [4 /*yield*/, ripple.getAccountInfo(addr)];
                case 3:
                    response = _a.sent();
                    return [2 /*return*/, response.xrpBalance];
                case 4:
                    error_1 = _a.sent();
                    balance = '0';
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, ripple.disconnect()];
                case 6:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/, balance];
            }
        });
    });
}
exports.getBalance = getBalance;
function getRecentHistory(network, addr) {
    return __awaiter(this, void 0, void 0, function () {
        var xrpNetwork, ripple, txlist, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xrpNetwork = getSupportedNetwork(network);
                    ripple = new ripple_lib_1.RippleAPI({
                        server: xrpNetwork.apiUrl,
                    });
                    return [4 /*yield*/, ripple.connect()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, 5, 7]);
                    return [4 /*yield*/, ripple.getTransactions(addr, {
                            limit: 50,
                        })];
                case 3:
                    // Note: do not add `types: ['payment']` here.
                    // It may crawl to the gensis block until it sees 50 payment transactions,
                    // but some addresses may have a lot of other transactions
                    txlist = _a.sent();
                    return [3 /*break*/, 7];
                case 4:
                    error_2 = _a.sent();
                    txlist = [];
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, ripple.disconnect()];
                case 6:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7:
                    // Instead, filter here
                    txlist = txlist.filter(function (tx) { return tx.type === 'payment' && !tx.specification.paths; });
                    // const util = require('util');
                    // console.log(util.inspect(txlist, false, null, true /* enable colors */));
                    return [2 /*return*/, txlist.map(function (item) {
                            var payment = item.specification;
                            var outcome = item.outcome;
                            var deliveredAmount = item.outcome.deliveredAmount;
                            var amount = deliveredAmount ? deliveredAmount.value : '0';
                            var isSelf = item.address === payment.destination.address;
                            var isSent = item.address === addr;
                            return {
                                type: {
                                    value: isSelf ? 'Self' : isSent ? 'Sent' : 'Received',
                                },
                                date: {
                                    value: new Date(outcome.timestamp || 0).toISOString(),
                                },
                                txid: {
                                    value: item.id,
                                    link: getUrlForTx(network, item.id),
                                },
                                to: {
                                    value: payment.destination.address,
                                    link: getUrlForAddr(network, payment.destination.address),
                                },
                                value: {
                                    value: amount,
                                },
                                fee: {
                                    value: outcome.fee,
                                },
                            };
                        })];
            }
        });
    });
}
exports.getRecentHistory = getRecentHistory;
function getPreparedTxSchema() {
    return [
        {
            key: 'from',
            format: 'address',
            label: 'From Address',
        },
        {
            key: 'value',
            format: 'value',
            label: 'Value',
        },
        {
            key: 'to',
            format: 'address',
            label: 'To Address',
        },
        {
            key: 'fee',
            format: 'value',
            label: 'Fee',
        },
        {
            key: 'sequence',
            format: 'number',
            label: 'Sequence',
        },
        {
            key: 'lastLedgerSequence',
            format: 'number',
            label: 'LastLedgerSequence',
        },
    ];
}
exports.getPreparedTxSchema = getPreparedTxSchema;
function prepareCommandSignTx(req) {
    return __awaiter(this, void 0, void 0, function () {
        var xrpNetwork, ripple, from, to, value, publicKey, account, fee, transactionJSON, instructions, preparedTx, rawTx, command, msg, pathList, armadillCommand, transaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xrpNetwork = getSupportedNetwork(req.network);
                    if (req.accountIndex < 0) {
                        throw Error('invalid account index');
                    }
                    if (!isValidAddr(req.network, req.toAddr)) {
                        throw Error('invalid to address');
                    }
                    if (!isValidNormAmount(req.amount)) {
                        throw Error('invalid amount');
                    }
                    if (typeof req.feeOpt !== 'undefined') {
                        throw new Error('No fee options available');
                    }
                    ripple = new ripple_lib_1.RippleAPI({
                        server: xrpNetwork.apiUrl,
                    });
                    return [4 /*yield*/, ripple.connect()];
                case 1:
                    _a.sent();
                    from = encodePubkeyToAddr(req.network, req.fromPubkey);
                    to = req.toAddr;
                    if (from === to) {
                        throw new Error("Should not send to self: " + from);
                    }
                    value = convertNormAmountToBaseAmount(req.amount);
                    publicKey = Buffer.from(req.fromPubkey, 'hex');
                    return [4 /*yield*/, ripple.getAccountInfo(from)];
                case 2:
                    account = _a.sent();
                    return [4 /*yield*/, ripple.getFee()];
                case 3:
                    fee = _a.sent();
                    transactionJSON = {
                        TransactionType: 'Payment',
                        Account: from,
                        Amount: value,
                        Destination: to,
                    };
                    instructions = {
                        fee: fee,
                        sequence: account.sequence,
                        maxLedgerVersionOffset: 300,
                    };
                    return [4 /*yield*/, ripple.prepareTransaction(transactionJSON, instructions)];
                case 4:
                    preparedTx = _a.sent();
                    return [4 /*yield*/, ripple.disconnect()];
                case 5:
                    _a.sent();
                    rawTx = JSON.parse(preparedTx.txJSON);
                    rawTx.SigningPubKey = secp256k1_1.default
                        .publicKeyConvert(publicKey, true)
                        .toString('hex')
                        .toUpperCase();
                    command = new ArmadilloProtob.Ripple.XrpCommand();
                    msg = new ArmadilloProtob.Ripple.XrpCommand.XrpSignTx();
                    pathList = Utils.getAccountPath(req.accountIndex);
                    msg.setPathList(pathList);
                    msg.setAccount(ripple_address_codec_1.decodeAccountID(from));
                    msg.setAmount(parseInt(rawTx.Amount, 10));
                    msg.setFee(parseInt(rawTx.Fee, 10));
                    msg.setDestination(ripple_address_codec_1.decodeAccountID(to));
                    msg.setSequence(rawTx.Sequence);
                    if (!!rawTx.LastLedgerSequence) {
                        msg.setLastLedgerSequence(rawTx.LastLedgerSequence);
                    }
                    command.setSignTx(msg);
                    armadillCommand = {
                        commandId: ArmadilloProtob.RIPPLE_CMDID,
                        payload: Buffer.from(command.serializeBinary()),
                    };
                    transaction = {
                        from: {
                            value: from,
                            link: getUrlForAddr(req.network, from),
                        },
                        to: {
                            value: to,
                            link: getUrlForAddr(req.network, to),
                        },
                        value: {
                            value: convertBaseAmountToNormAmount(rawTx.Amount),
                        },
                        fee: {
                            value: convertBaseAmountToNormAmount(rawTx.Fee),
                        },
                        sequence: {
                            value: "" + rawTx.Sequence,
                        },
                        lastLedgerSequence: {
                            value: "" + rawTx.LastLedgerSequence,
                        },
                    };
                    return [2 /*return*/, [armadillCommand, transaction, rawTx]];
            }
        });
    });
}
exports.prepareCommandSignTx = prepareCommandSignTx;
function buildSignedTx(req, preparedTx, walletRsp, rawTx) {
    var response = ArmadilloProtob.Ripple.XrpResponse.deserializeBinary(walletRsp.payload);
    var data = response.getSig();
    if (!data) {
        throw Error('invalid wallet response');
    }
    var sigBuffer = Buffer.from(data.getSig_asU8());
    var r = sigBuffer.slice(0, 32);
    var s = sigBuffer.slice(32);
    var ECSignature = require('elliptic/lib/elliptic/ec/signature');
    var ecSignature = new ECSignature({
        r: r.toString('hex'),
        s: s.toString('hex'),
    });
    rawTx.TxnSignature = ecSignature.toDER('hex').toUpperCase();
    var signedTx = ripple_binary_codec_1.encode(rawTx);
    if (ripple_keypairs_1.verify(binary_1.bytesToHex(binary_1.serializeObject(rawTx, {
        prefix: hash_prefixes_1.HashPrefix.transactionSig,
        signingFieldsOnly: true,
    })), rawTx.TxnSignature, rawTx.SigningPubKey)) {
        return signedTx;
    }
    else {
        throw Error('invalid tx');
    }
}
exports.buildSignedTx = buildSignedTx;
