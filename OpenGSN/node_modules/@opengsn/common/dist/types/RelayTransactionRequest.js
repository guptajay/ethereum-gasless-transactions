"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ow_1 = __importDefault(require("ow"));
exports.RelayTransactionRequestShape = {
    relayRequest: {
        request: {
            from: ow_1.default.string,
            to: ow_1.default.string,
            data: ow_1.default.string,
            value: ow_1.default.string,
            nonce: ow_1.default.string,
            gas: ow_1.default.string,
            validUntil: ow_1.default.string
        },
        relayData: {
            gasPrice: ow_1.default.string,
            pctRelayFee: ow_1.default.string,
            baseRelayFee: ow_1.default.string,
            relayWorker: ow_1.default.string,
            paymaster: ow_1.default.string,
            paymasterData: ow_1.default.string,
            clientId: ow_1.default.string,
            forwarder: ow_1.default.string
        }
    },
    metadata: {
        approvalData: ow_1.default.string,
        relayHubAddress: ow_1.default.string,
        relayMaxNonce: ow_1.default.number,
        signature: ow_1.default.string
    }
};
//# sourceMappingURL=RelayTransactionRequest.js.map