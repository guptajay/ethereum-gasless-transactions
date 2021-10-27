"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpClient {
    constructor(httpWrapper, logger) {
        this.httpWrapper = httpWrapper;
        this.logger = logger;
    }
    async getPingResponse(relayUrl, paymaster) {
        const paymasterSuffix = paymaster == null ? '' : '?paymaster=' + paymaster;
        const pingResponse = await this.httpWrapper.sendPromise(relayUrl + '/getaddr' + paymasterSuffix);
        this.logger.info(`pingResponse: ${JSON.stringify(pingResponse)}`);
        if (pingResponse == null) {
            throw new Error('Relay responded without a body');
        }
        return pingResponse;
    }
    async relayTransaction(relayUrl, request) {
        const { signedTx, error } = await this.httpWrapper.sendPromise(relayUrl + '/relay', request);
        this.logger.info(`relayTransaction response: ${signedTx}, error: ${error}`);
        if (error != null) {
            throw new Error(`Got error response from relay: ${error}`);
        }
        if (signedTx == null) {
            throw new Error('body.signedTx field missing.');
        }
        return signedTx;
    }
    async auditTransaction(relayUrl, signedTx) {
        const auditRequest = { signedTx };
        const auditResponse = await this.httpWrapper.sendPromise(relayUrl + '/audit', auditRequest);
        this.logger.info(`auditTransaction response: ${JSON.stringify(auditResponse)}`);
        return auditResponse;
    }
}
exports.HttpClient = HttpClient;
//# sourceMappingURL=HttpClient.js.map