"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_tx_1 = require("ethereumjs-tx");
const ethereumjs_util_1 = require("ethereumjs-util");
const Utils_1 = require("@opengsn/common/dist/Utils");
class RelayedTransactionValidator {
    constructor(contractInteractor, logger, config) {
        this.contractInteractor = contractInteractor;
        this.config = config;
        this.logger = logger;
    }
    /**
     * Decode the signed transaction returned from the Relay Server, compare it to the
     * requested transaction and validate its signature.
     * @returns a signed {@link Transaction} instance for broadcasting, or null if returned
     * transaction is not valid.
     */
    validateRelayResponse(request, maxAcceptanceBudget, returnedTx) {
        const transaction = new ethereumjs_tx_1.Transaction(returnedTx, this.contractInteractor.getRawTxOptions());
        this.logger.info(`returnedTx:
    v:        ${ethereumjs_util_1.bufferToHex(transaction.v)}
    r:        ${ethereumjs_util_1.bufferToHex(transaction.r)}
    s:        ${ethereumjs_util_1.bufferToHex(transaction.s)}
    to:       ${ethereumjs_util_1.bufferToHex(transaction.to)}
    data:     ${ethereumjs_util_1.bufferToHex(transaction.data)}
    gasLimit: ${ethereumjs_util_1.bufferToHex(transaction.gasLimit)}
    gasPrice: ${ethereumjs_util_1.bufferToHex(transaction.gasPrice)}
    value:    ${ethereumjs_util_1.bufferToHex(transaction.value)}
    `);
        const signer = ethereumjs_util_1.bufferToHex(transaction.getSenderAddress());
        const externalGasLimit = ethereumjs_util_1.bufferToHex(transaction.gasLimit);
        const relayRequestAbiEncode = this.contractInteractor.encodeABI(maxAcceptanceBudget, request.relayRequest, request.metadata.signature, request.metadata.approvalData, externalGasLimit);
        const relayHubAddress = this.contractInteractor.getDeployment().relayHubAddress;
        if (relayHubAddress == null) {
            throw new Error('no hub address');
        }
        if (Utils_1.isSameAddress(ethereumjs_util_1.bufferToHex(transaction.to), relayHubAddress) &&
            relayRequestAbiEncode === ethereumjs_util_1.bufferToHex(transaction.data) &&
            Utils_1.isSameAddress(request.relayRequest.relayData.relayWorker, signer)) {
            this.logger.info('validateRelayResponse - valid transaction response');
            // TODO: the relayServer encoder returns zero-length buffer for nonce=0.`
            const receivedNonce = transaction.nonce.length === 0 ? 0 : transaction.nonce.readUIntBE(0, transaction.nonce.byteLength);
            if (receivedNonce > request.metadata.relayMaxNonce) {
                // TODO: need to validate that client retries the same request and doesn't double-spend.
                // Note that this transaction is totally valid from the EVM's point of view
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                throw new Error(`Relay used a tx nonce higher than requested. Requested ${request.metadata.relayMaxNonce} got ${receivedNonce}`);
            }
            return true;
        }
        else {
            console.error('validateRelayResponse: req', relayRequestAbiEncode, relayHubAddress, request.relayRequest.relayData.relayWorker);
            console.error('validateRelayResponse: rsp', ethereumjs_util_1.bufferToHex(transaction.data), ethereumjs_util_1.bufferToHex(transaction.to), signer);
            return false;
        }
    }
}
exports.RelayedTransactionValidator = RelayedTransactionValidator;
//# sourceMappingURL=RelayedTransactionValidator.js.map