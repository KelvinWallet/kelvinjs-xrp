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
Object.defineProperty(exports, "__esModule", { value: true });
var Core = __importStar(require("./core"));
var Ripple = /** @class */ (function () {
    function Ripple() {
        this.rawTx = false;
    }
    Ripple.prototype.getSupportedNetworks = function () {
        return Core.getSupportedNetworks();
    };
    Ripple.prototype.getFeeOptionUnit = function () {
        return Core.getFeeOptionUnit();
    };
    Ripple.prototype.isValidFeeOption = function (network, feeOpt) {
        return Core.isValidFeeOption(network, feeOpt);
    };
    Ripple.prototype.isValidAddr = function (network, addr) {
        return Core.isValidAddr(network, addr);
    };
    Ripple.prototype.isValidNormAmount = function (amount) {
        return Core.isValidNormAmount(amount);
    };
    Ripple.prototype.convertNormAmountToBaseAmount = function (amount) {
        return Core.convertNormAmountToBaseAmount(amount);
    };
    Ripple.prototype.convertBaseAmountToNormAmount = function (amount) {
        return Core.convertBaseAmountToNormAmount(amount);
    };
    Ripple.prototype.getUrlForAddr = function (network, addr) {
        return Core.getUrlForAddr(network, addr);
    };
    Ripple.prototype.getUrlForTx = function (network, txid) {
        return Core.getUrlForTx(network, txid);
    };
    Ripple.prototype.encodePubkeyToAddr = function (network, pubkey) {
        return Core.encodePubkeyToAddr(network, pubkey);
    };
    Ripple.prototype.getBalance = function (network, addr) {
        return Core.getBalance(network, addr);
    };
    Ripple.prototype.getHistorySchema = function () {
        return Core.getHistorySchema();
    };
    Ripple.prototype.getRecentHistory = function (network, addr) {
        return Core.getRecentHistory(network, addr);
    };
    Ripple.prototype.getFeeOptions = function (network) {
        return Core.getFeeOptions(network);
    };
    Ripple.prototype.getPreparedTxSchema = function () {
        return Core.getPreparedTxSchema();
    };
    Ripple.prototype.prepareCommandSignTx = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, command, transaction, rawTx;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Core.prepareCommandSignTx(req)];
                    case 1:
                        _a = _b.sent(), command = _a[0], transaction = _a[1], rawTx = _a[2];
                        this.rawTx = rawTx;
                        return [2 /*return*/, [command, transaction]];
                }
            });
        });
    };
    Ripple.prototype.buildSignedTx = function (req, preparedTx, walletRsp) {
        if (!this.rawTx) {
            throw Error('must prepare command to sign tx first');
        }
        var response = Core.buildSignedTx(req, preparedTx, walletRsp, this.rawTx);
        this.rawTx = false;
        return response;
    };
    Ripple.prototype.submitTransaction = function (network, signedTx) {
        return Core.submitTransaction(network, signedTx);
    };
    Ripple.prototype.prepareCommandGetPubkey = function (network, accountIndex) {
        return Core.prepareCommandGetPubkey(network, accountIndex);
    };
    Ripple.prototype.parsePubkeyResponse = function (walletRsp) {
        return Core.parsePubkeyResponse(walletRsp);
    };
    Ripple.prototype.prepareCommandShowAddr = function (network, accountIndex) {
        return Core.prepareCommandShowAddr(network, accountIndex);
    };
    return Ripple;
}());
exports.default = Ripple;
