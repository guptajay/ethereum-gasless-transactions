"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_utils_1 = __importDefault(require("web3-utils"));
const WrapperProviderBase_1 = require("./WrapperProviderBase");
class NetworkSimulatingProvider extends WrapperProviderBase_1.WrapperProviderBase {
    constructor(provider) {
        super(provider);
        this.isDelayTransactionsOn = false;
        this.mempool = new Map();
    }
    setDelayTransactions(delayTransactions) {
        this.isDelayTransactionsOn = delayTransactions;
    }
    calculateTxHash(payload) {
        const txHash = web3_utils_1.default.sha3(payload.params[0]);
        if (txHash == null) {
            throw new Error('Failed to hash transaction');
        }
        return txHash;
    }
    send(payload, callback) {
        let resp;
        switch (payload.method) {
            case 'eth_sendRawTransaction':
                if (this.isDelayTransactionsOn) {
                    const txHash = this.calculateTxHash(payload);
                    resp = {
                        jsonrpc: '2.0',
                        id: castId(payload.id),
                        result: txHash
                    };
                    this.mempool.set(txHash, payload);
                }
                break;
        }
        if (resp != null) {
            callback(null, resp);
        }
        else {
            this.provider.send(payload, callback);
        }
    }
    supportsSubscriptions() {
        return false;
    }
    async mineTransaction(txHash) {
        const txPayload = this.mempool.get(txHash);
        this.mempool.delete(txHash);
        return await new Promise((resolve, reject) => {
            if (txPayload == null) {
                throw new Error('Transaction is not in simulated mempool. It must be already mined');
            }
            this.provider.send(txPayload, function (error, result) {
                if (error != null || result == null) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
exports.NetworkSimulatingProvider = NetworkSimulatingProvider;
function castId(id) {
    if (typeof id === 'string') {
        return parseInt(id);
    }
    else if (typeof id === 'number') {
        return id;
    }
    else {
        return 0;
    }
}
//# sourceMappingURL=NetworkSimulatingProvider.js.map