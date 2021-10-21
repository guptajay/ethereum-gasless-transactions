"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const ethereumjs_tx_1 = require("ethereumjs-tx");
const ethereumjs_util_1 = require("ethereumjs-util");
const ContractInteractor_1 = require("@opengsn/common/dist/ContractInteractor");
const VersionsManager_1 = require("@opengsn/common/dist/VersionsManager");
const Utils_1 = require("@opengsn/common/dist/Utils");
const Version_1 = require("@opengsn/common/dist/Version");
const AccountManager_1 = require("./AccountManager");
const HttpClient_1 = require("@opengsn/common/dist/HttpClient");
const HttpWrapper_1 = require("@opengsn/common/dist/HttpWrapper");
const RelaySelectionManager_1 = require("./RelaySelectionManager");
const RelayedTransactionValidator_1 = require("./RelayedTransactionValidator");
const KnownRelaysManager_1 = require("./KnownRelaysManager");
const ClientWinstonLogger_1 = require("./ClientWinstonLogger");
const GSNConfigurator_1 = require("./GSNConfigurator");
const GsnEvents_1 = require("./GsnEvents");
// forwarder requests are signed with expiration time.
const REQUEST_VALID_BLOCKS = 6000; // roughly a day
// generate "approvalData" and "paymasterData" for a request.
// both are bytes arrays. paymasterData is part of the client request.
// approvalData is created after request is filled and signed.
exports.EmptyDataCallback = async () => {
    return '0x';
};
exports.GasPricePingFilter = (pingResponse, gsnTransactionDetails) => {
    if (gsnTransactionDetails.gasPrice != null &&
        parseInt(pingResponse.minGasPrice) > parseInt(gsnTransactionDetails.gasPrice)) {
        throw new Error(`Proposed gas price: ${gsnTransactionDetails.gasPrice}; relay's MinGasPrice: ${pingResponse.minGasPrice}`);
    }
};
class RelayClient {
    constructor(rawConstructorInput) {
        var _a, _b, _c, _d;
        this.emitter = new events_1.EventEmitter();
        this.initialized = false;
        // TODO: backwards-compatibility 102 - remove on next version bump
        if (arguments[0] == null || arguments[0].send != null || arguments[2] != null) {
            throw new Error('Sorry, but the constructor parameters of the RelayClient class have changed. See "GSNUnresolvedConstructorInput" interface for details.');
        }
        this.rawConstructorInput = rawConstructorInput;
        this.logger = (_b = (_a = rawConstructorInput.overrideDependencies) === null || _a === void 0 ? void 0 : _a.logger) !== null && _b !== void 0 ? _b : ClientWinstonLogger_1.createClientLogger((_d = (_c = rawConstructorInput.config) === null || _c === void 0 ? void 0 : _c.loggerConfiguration) !== null && _d !== void 0 ? _d : GSNConfigurator_1.defaultLoggerConfiguration);
    }
    async init() {
        if (this.initialized) {
            throw new Error('init() already called');
        }
        this.initializingPromise = this._initInternal();
        await this.initializingPromise;
        this.initialized = true;
        return this;
    }
    async _initInternal() {
        this.emit(new GsnEvents_1.GsnInitEvent());
        this.config = await this._resolveConfiguration(this.rawConstructorInput);
        this.dependencies = await this._resolveDependencies(this.rawConstructorInput);
    }
    /**
     * register a listener for GSN events
     * @see GsnEvent and its subclasses for emitted events
     * @param handler callback function to handle events
     */
    registerEventListener(handler) {
        this.emitter.on('gsn', handler);
    }
    /**
     * unregister previously registered event listener
     * @param handler callback function to unregister
     */
    unregisterEventListener(handler) {
        this.emitter.off('gsn', handler);
    }
    emit(event) {
        this.emitter.emit('gsn', event);
    }
    /**
     * In case Relay Server does not broadcast the signed transaction to the network,
     * client also broadcasts the same transaction. If the transaction fails with nonce
     * error, it indicates Relay may have signed multiple transactions with same nonce,
     * causing a DoS attack.
     *
     * @param {*} transaction - actual Ethereum transaction, signed by a relay
     */
    async _broadcastRawTx(transaction) {
        const rawTx = '0x' + transaction.serialize().toString('hex');
        const txHash = '0x' + transaction.hash(true).toString('hex');
        this.logger.info(`Broadcasting raw transaction signed by relay. TxHash: ${txHash}`);
        try {
            if (await this._isAlreadySubmitted(txHash)) {
                return { hasReceipt: true };
            }
            // can't find the TX in the mempool. broadcast it ourselves.
            await this.dependencies.contractInteractor.sendSignedTransaction(rawTx);
            return { hasReceipt: true };
        }
        catch (broadcastError) {
            // don't display error for the known-good cases
            if ((broadcastError === null || broadcastError === void 0 ? void 0 : broadcastError.message.match(/the tx doesn't have the correct nonce|known transaction/)) != null) {
                return {
                    hasReceipt: false,
                    wrongNonce: true,
                    broadcastError
                };
            }
            return { hasReceipt: false, broadcastError };
        }
    }
    async _isAlreadySubmitted(txHash) {
        const [txMinedReceipt, pendingBlock] = await Promise.all([
            this.dependencies.contractInteractor.web3.eth.getTransactionReceipt(txHash),
            // mempool transactions
            this.dependencies.contractInteractor.web3.eth.getBlock('pending')
        ]);
        if (txMinedReceipt != null) {
            return true;
        }
        return pendingBlock.transactions.includes(txHash);
    }
    async relayTransaction(gsnTransactionDetails) {
        var _a, _b;
        if (!this.initialized) {
            if (this.initializingPromise == null) {
                this._warn('suggestion: call RelayProvider.init()/RelayClient.init() in advance (to make first request faster)');
            }
            await this.init();
        }
        // TODO: should have a better strategy to decide how often to refresh known relays
        this.emit(new GsnEvents_1.GsnRefreshRelaysEvent());
        await this.dependencies.knownRelaysManager.refresh();
        gsnTransactionDetails.gasPrice = (_a = gsnTransactionDetails.forceGasPrice) !== null && _a !== void 0 ? _a : await this._calculateGasPrice();
        if (gsnTransactionDetails.gas == null) {
            const estimated = await this.dependencies.contractInteractor.estimateGas(gsnTransactionDetails);
            gsnTransactionDetails.gas = `0x${estimated.toString(16)}`;
        }
        const relaySelectionManager = await new RelaySelectionManager_1.RelaySelectionManager(gsnTransactionDetails, this.dependencies.knownRelaysManager, this.dependencies.httpClient, this.dependencies.pingFilter, this.logger, this.config).init();
        const count = relaySelectionManager.relaysLeft().length;
        this.emit(new GsnEvents_1.GsnDoneRefreshRelaysEvent(count));
        if (count === 0) {
            throw new Error('no registered relayers');
        }
        const relayingErrors = new Map();
        const auditPromises = [];
        while (true) {
            let relayingAttempt;
            const activeRelay = await relaySelectionManager.selectNextRelay();
            if (activeRelay != null) {
                this.emit(new GsnEvents_1.GsnNextRelayEvent(activeRelay.relayInfo.relayUrl));
                relayingAttempt = await this._attemptRelay(activeRelay, gsnTransactionDetails)
                    .catch(error => ({ error }));
                if (relayingAttempt.auditPromise != null) {
                    auditPromises.push(relayingAttempt.auditPromise);
                }
                if (relayingAttempt.transaction == null) {
                    relayingErrors.set(activeRelay.relayInfo.relayUrl, (_b = relayingAttempt.error) !== null && _b !== void 0 ? _b : new Error('No error reason was given'));
                    continue;
                }
            }
            return {
                transaction: relayingAttempt === null || relayingAttempt === void 0 ? void 0 : relayingAttempt.transaction,
                relayingErrors,
                auditPromises,
                pingErrors: relaySelectionManager.errors
            };
        }
    }
    _warn(msg) {
        this.logger.warn(msg);
    }
    async _calculateGasPrice() {
        const pct = this.config.gasPriceFactorPercent;
        const networkGasPrice = await this.dependencies.contractInteractor.getGasPrice();
        let gasPrice = Math.round(parseInt(networkGasPrice) * (pct + 100) / 100);
        if (this.config.minGasPrice != null && gasPrice < this.config.minGasPrice) {
            gasPrice = this.config.minGasPrice;
        }
        return `0x${gasPrice.toString(16)}`;
    }
    async _attemptRelay(relayInfo, gsnTransactionDetails) {
        this.logger.info(`attempting relay: ${JSON.stringify(relayInfo)} transaction: ${JSON.stringify(gsnTransactionDetails)}`);
        const maxAcceptanceBudget = parseInt(relayInfo.pingResponse.maxAcceptanceBudget);
        const httpRequest = await this._prepareRelayHttpRequest(relayInfo, gsnTransactionDetails);
        this.emit(new GsnEvents_1.GsnValidateRequestEvent());
        const acceptRelayCallResult = await this.dependencies.contractInteractor.validateRelayCall(maxAcceptanceBudget, httpRequest.relayRequest, httpRequest.metadata.signature, httpRequest.metadata.approvalData, this.config.maxViewableGasLimit);
        if (!acceptRelayCallResult.paymasterAccepted) {
            let message;
            if (acceptRelayCallResult.reverted) {
                message = 'local view call to \'relayCall()\' reverted';
            }
            else {
                message = 'paymaster rejected in local view call to \'relayCall()\' ';
            }
            return { error: new Error(`${message}: ${Utils_1.decodeRevertReason(acceptRelayCallResult.returnValue)}`) };
        }
        let hexTransaction;
        let transaction;
        let auditPromise;
        this.emit(new GsnEvents_1.GsnSendToRelayerEvent(relayInfo.relayInfo.relayUrl));
        try {
            hexTransaction = await this.dependencies.httpClient.relayTransaction(relayInfo.relayInfo.relayUrl, httpRequest);
            transaction = new ethereumjs_tx_1.Transaction(hexTransaction, this.dependencies.contractInteractor.getRawTxOptions());
            auditPromise = this.auditTransaction(hexTransaction, relayInfo.relayInfo.relayUrl)
                .then((penalizeResponse) => {
                if (penalizeResponse.commitTxHash != null) {
                    const txHash = ethereumjs_util_1.bufferToHex(transaction.hash(true));
                    this.logger.error(`The transaction with id: ${txHash} was penalized! Penalization commitment tx id: ${penalizeResponse.commitTxHash}`);
                }
                return penalizeResponse;
            });
        }
        catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.message) == null || error.message.indexOf('timeout') !== -1) {
                this.dependencies.knownRelaysManager.saveRelayFailure(new Date().getTime(), relayInfo.relayInfo.relayManager, relayInfo.relayInfo.relayUrl);
            }
            this.logger.info(`relayTransaction: ${JSON.stringify(httpRequest)}`);
            return { error };
        }
        if (!this.dependencies.transactionValidator.validateRelayResponse(httpRequest, maxAcceptanceBudget, hexTransaction)) {
            this.emit(new GsnEvents_1.GsnRelayerResponseEvent(false));
            this.dependencies.knownRelaysManager.saveRelayFailure(new Date().getTime(), relayInfo.relayInfo.relayManager, relayInfo.relayInfo.relayUrl);
            return {
                auditPromise,
                error: new Error('Returned transaction did not pass validation')
            };
        }
        this.emit(new GsnEvents_1.GsnRelayerResponseEvent(true));
        await this._broadcastRawTx(transaction);
        return {
            auditPromise,
            transaction
        };
    }
    async _prepareRelayHttpRequest(relayInfo, gsnTransactionDetails) {
        var _a, _b, _c;
        const relayHubAddress = this.dependencies.contractInteractor.getDeployment().relayHubAddress;
        const forwarder = (_a = gsnTransactionDetails.forwarder) !== null && _a !== void 0 ? _a : this.dependencies.contractInteractor.getDeployment().forwarderAddress;
        const paymaster = (_b = gsnTransactionDetails.paymaster) !== null && _b !== void 0 ? _b : this.dependencies.contractInteractor.getDeployment().paymasterAddress;
        if (relayHubAddress == null || paymaster == null || forwarder == null) {
            throw new Error('Contract addresses are not initialized!');
        }
        // valid that many blocks into the future.
        const validUntilPromise = this.dependencies.contractInteractor.getBlockNumber()
            .then((num) => (num + REQUEST_VALID_BLOCKS).toString());
        const senderNonce = await this.dependencies.contractInteractor.getSenderNonce(gsnTransactionDetails.from, forwarder);
        const relayWorker = relayInfo.pingResponse.relayWorkerAddress;
        const gasPriceHex = gsnTransactionDetails.gasPrice;
        const gasLimitHex = gsnTransactionDetails.gas;
        if (gasPriceHex == null || gasLimitHex == null) {
            throw new Error('RelayClient internal exception. Gas price or gas limit still not calculated. Cannot happen.');
        }
        if (gasPriceHex.indexOf('0x') !== 0) {
            throw new Error(`Invalid gasPrice hex string: ${gasPriceHex}`);
        }
        if (gasLimitHex.indexOf('0x') !== 0) {
            throw new Error(`Invalid gasLimit hex string: ${gasLimitHex}`);
        }
        const gasLimit = parseInt(gasLimitHex, 16).toString();
        const gasPrice = parseInt(gasPriceHex, 16).toString();
        const value = (_c = gsnTransactionDetails.value) !== null && _c !== void 0 ? _c : '0';
        const relayRequest = {
            request: {
                to: gsnTransactionDetails.to,
                data: gsnTransactionDetails.data,
                from: gsnTransactionDetails.from,
                value: value,
                nonce: senderNonce,
                gas: gasLimit,
                validUntil: await validUntilPromise
            },
            relayData: {
                pctRelayFee: relayInfo.relayInfo.pctRelayFee,
                baseRelayFee: relayInfo.relayInfo.baseRelayFee,
                gasPrice,
                paymaster,
                paymasterData: '',
                clientId: this.config.clientId,
                forwarder,
                relayWorker
            }
        };
        // put paymasterData into struct before signing
        relayRequest.relayData.paymasterData = await this.dependencies.asyncPaymasterData(relayRequest);
        this.emit(new GsnEvents_1.GsnSignRequestEvent());
        const signature = await this.dependencies.accountManager.sign(relayRequest);
        const approvalData = await this.dependencies.asyncApprovalData(relayRequest);
        // max nonce is not signed, as contracts cannot access addresses' nonces.
        const transactionCount = await this.dependencies.contractInteractor.getTransactionCount(relayWorker);
        const relayMaxNonce = transactionCount + this.config.maxRelayNonceGap;
        // TODO: the server accepts a flat object, and that is why this code looks like shit.
        //  Must teach server to accept correct types
        const metadata = {
            relayHubAddress,
            signature,
            approvalData,
            relayMaxNonce
        };
        const httpRequest = {
            relayRequest,
            metadata
        };
        this.logger.info(`Created HTTP relay request: ${JSON.stringify(httpRequest)}`);
        return httpRequest;
    }
    newAccount() {
        this._verifyInitialized();
        return this.dependencies.accountManager.newAccount();
    }
    addAccount(privateKey) {
        this._verifyInitialized();
        this.dependencies.accountManager.addAccount(privateKey);
    }
    _verifyInitialized() {
        if (!this.initialized) {
            throw new Error('not initialized. must call RelayClient.init()');
        }
    }
    async auditTransaction(hexTransaction, sourceRelayUrl) {
        const auditors = this.dependencies.knownRelaysManager.getAuditors([sourceRelayUrl]);
        let failedAuditorsCount = 0;
        for (const auditor of auditors) {
            try {
                const penalizeResponse = await this.dependencies.httpClient.auditTransaction(auditor, hexTransaction);
                if (penalizeResponse.commitTxHash != null) {
                    return penalizeResponse;
                }
            }
            catch (e) {
                failedAuditorsCount++;
                this.logger.info(`Audit call failed for relay at URL: ${auditor}. Failed audit calls: ${failedAuditorsCount}/${auditors.length}`);
            }
        }
        if (auditors.length === failedAuditorsCount && failedAuditorsCount !== 0) {
            this.logger.error('All auditors failed!');
        }
        return {
            message: `Transaction was not audited. Failed audit calls: ${failedAuditorsCount}/${auditors.length}`
        };
    }
    getUnderlyingProvider() {
        return this.rawConstructorInput.provider;
    }
    async _resolveConfiguration({ provider, config = {} }) {
        var _a, _b;
        const isMetamask = provider.isMetaMask;
        // provide defaults valid for metamask (unless explicitly specified values)
        const methodSuffix = (_a = config.methodSuffix) !== null && _a !== void 0 ? _a : (isMetamask ? '_v4' : GSNConfigurator_1.defaultGsnConfig.methodSuffix);
        const jsonStringifyRequest = (_b = config.jsonStringifyRequest) !== null && _b !== void 0 ? _b : (isMetamask ? true : GSNConfigurator_1.defaultGsnConfig.jsonStringifyRequest);
        const resolvedConfig = {
            methodSuffix,
            jsonStringifyRequest
        };
        return Object.assign(Object.assign(Object.assign({}, GSNConfigurator_1.defaultGsnConfig), resolvedConfig), config);
    }
    async _resolveDependencies({ provider, config = {}, overrideDependencies = {} }) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const versionManager = new VersionsManager_1.VersionsManager(Version_1.gsnRuntimeVersion, (_a = config.requiredVersionRange) !== null && _a !== void 0 ? _a : Version_1.gsnRequiredVersion);
        const contractInteractor = (_b = overrideDependencies === null || overrideDependencies === void 0 ? void 0 : overrideDependencies.contractInteractor) !== null && _b !== void 0 ? _b : await new ContractInteractor_1.ContractInteractor({
            provider,
            versionManager,
            logger: this.logger,
            maxPageSize: this.config.pastEventsQueryMaxPageSize,
            deployment: { paymasterAddress: config === null || config === void 0 ? void 0 : config.paymasterAddress }
        }).init();
        const accountManager = (_c = overrideDependencies === null || overrideDependencies === void 0 ? void 0 : overrideDependencies.accountManager) !== null && _c !== void 0 ? _c : new AccountManager_1.AccountManager(provider, contractInteractor.chainId, this.config);
        const httpClient = (_d = overrideDependencies === null || overrideDependencies === void 0 ? void 0 : overrideDependencies.httpClient) !== null && _d !== void 0 ? _d : new HttpClient_1.HttpClient(new HttpWrapper_1.HttpWrapper(), this.logger);
        const pingFilter = (_e = overrideDependencies === null || overrideDependencies === void 0 ? void 0 : overrideDependencies.pingFilter) !== null && _e !== void 0 ? _e : exports.GasPricePingFilter;
        const relayFilter = (_f = overrideDependencies === null || overrideDependencies === void 0 ? void 0 : overrideDependencies.relayFilter) !== null && _f !== void 0 ? _f : KnownRelaysManager_1.EmptyFilter;
        const asyncApprovalData = (_g = overrideDependencies === null || overrideDependencies === void 0 ? void 0 : overrideDependencies.asyncApprovalData) !== null && _g !== void 0 ? _g : exports.EmptyDataCallback;
        const asyncPaymasterData = (_h = overrideDependencies === null || overrideDependencies === void 0 ? void 0 : overrideDependencies.asyncPaymasterData) !== null && _h !== void 0 ? _h : exports.EmptyDataCallback;
        const scoreCalculator = (_j = overrideDependencies === null || overrideDependencies === void 0 ? void 0 : overrideDependencies.scoreCalculator) !== null && _j !== void 0 ? _j : KnownRelaysManager_1.DefaultRelayScore;
        const knownRelaysManager = (_k = overrideDependencies === null || overrideDependencies === void 0 ? void 0 : overrideDependencies.knownRelaysManager) !== null && _k !== void 0 ? _k : new KnownRelaysManager_1.KnownRelaysManager(contractInteractor, this.logger, this.config, relayFilter);
        const transactionValidator = (_l = overrideDependencies === null || overrideDependencies === void 0 ? void 0 : overrideDependencies.transactionValidator) !== null && _l !== void 0 ? _l : new RelayedTransactionValidator_1.RelayedTransactionValidator(contractInteractor, this.logger, this.config);
        return {
            logger: this.logger,
            httpClient,
            contractInteractor,
            knownRelaysManager,
            accountManager,
            transactionValidator,
            pingFilter,
            relayFilter,
            asyncApprovalData,
            asyncPaymasterData,
            scoreCalculator
        };
    }
}
exports.RelayClient = RelayClient;
function _dumpRelayingResult(relayingResult) {
    let str = '';
    if (relayingResult.pingErrors.size > 0) {
        str += `Ping errors (${relayingResult.pingErrors.size}):`;
        Array.from(relayingResult.pingErrors.keys()).forEach(e => {
            var _a, _b;
            const err = relayingResult.pingErrors.get(e);
            const error = (_b = (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : err === null || err === void 0 ? void 0 : err.toString()) !== null && _b !== void 0 ? _b : '';
            str += `\n${e} => ${error}\n`;
        });
    }
    if (relayingResult.relayingErrors.size > 0) {
        str += `Relaying errors (${relayingResult.relayingErrors.size}):\n`;
        Array.from(relayingResult.relayingErrors.keys()).forEach(e => {
            var _a, _b;
            const err = relayingResult.relayingErrors.get(e);
            const error = (_b = (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : err === null || err === void 0 ? void 0 : err.toString()) !== null && _b !== void 0 ? _b : '';
            str += `${e} => ${error}`;
        });
    }
    return str;
}
exports._dumpRelayingResult = _dumpRelayingResult;
//# sourceMappingURL=RelayClient.js.map