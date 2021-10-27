"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultReputationConfig = {
    initialReputation: 3,
    maximumReputation: 100,
    throttleReputation: 5,
    throttleDelayMs: 60000,
    blockReputation: 0,
    abuseTimeoutReputation: 1,
    abuseReputationChange: 20,
    abuseTimeWindowBlocks: 240,
    abuseBlacklistDurationBlocks: 6000
};
/**
 * Only Paymaster marked as {@link GOOD} is to be allowed to proceed.
 * Note: {@link THROTTLED} value is returned only if subsequent transaction is requested too soon.
 */
var PaymasterStatus;
(function (PaymasterStatus) {
    PaymasterStatus[PaymasterStatus["GOOD"] = 0] = "GOOD";
    PaymasterStatus[PaymasterStatus["THROTTLED"] = 1] = "THROTTLED";
    PaymasterStatus[PaymasterStatus["ABUSED"] = 2] = "ABUSED";
    PaymasterStatus[PaymasterStatus["BLOCKED"] = 3] = "BLOCKED";
})(PaymasterStatus = exports.PaymasterStatus || (exports.PaymasterStatus = {}));
function resolveReputationManagerConfiguration(partialConfig) {
    return Object.assign({}, defaultReputationConfig, partialConfig);
}
class ReputationManager {
    constructor(reputationStoreManager, logger, partialConfig) {
        this.config = resolveReputationManagerConfiguration(partialConfig);
        this.reputationStoreManager = reputationStoreManager;
        this.logger = logger;
    }
    async getPaymasterStatus(paymaster, currentBlockNumber) {
        var _a;
        const entry = (_a = await this.reputationStoreManager.getEntry(paymaster)) !== null && _a !== void 0 ? _a : await this.reputationStoreManager.createEntry(paymaster, this.config.initialReputation);
        if (entry.reputation <= this.config.blockReputation) {
            return PaymasterStatus.BLOCKED;
        }
        if (entry.abuseStartedBlock !== 0) {
            if (currentBlockNumber - entry.abuseStartedBlock <= this.config.abuseTimeWindowBlocks) {
                return PaymasterStatus.ABUSED;
            }
            else {
                await this.reputationStoreManager.clearAbuseFlag(paymaster, this.config.abuseTimeoutReputation);
            }
        }
        if (entry.reputation < this.config.throttleReputation &&
            Date.now() - entry.lastAcceptedRelayRequestTs <= this.config.throttleDelayMs) {
            return PaymasterStatus.THROTTLED;
        }
        return PaymasterStatus.GOOD;
    }
    async onRelayRequestAccepted(paymaster) {
        await this.reputationStoreManager.updateLastAcceptedTimestamp(paymaster);
    }
    async updatePaymasterStatus(paymaster, transactionSuccess, eventBlockNumber) {
        var _a;
        const change = transactionSuccess ? 1 : -1;
        const entry = (_a = await this.reputationStoreManager.getEntry(paymaster)) !== null && _a !== void 0 ? _a : await this.reputationStoreManager.createEntry(paymaster, this.config.initialReputation);
        if (entry == null) {
            throw new Error(`Could not query reputation for paymaster: ${paymaster}`);
        }
        if (entry.reputation + change > this.config.maximumReputation) {
            return;
        }
        const changeInAbuseWindow = entry.changes
            .filter(it => eventBlockNumber - it.blockNumber < this.config.abuseTimeWindowBlocks)
            .reduce((previousValue, currentValue) => previousValue + currentValue.change, 0);
        if (-changeInAbuseWindow >= this.config.abuseReputationChange) {
            await this.reputationStoreManager.setAbuseFlag(paymaster, eventBlockNumber);
        }
        const oldChangesExpirationBlock = eventBlockNumber - this.config.abuseTimeWindowBlocks;
        await this.reputationStoreManager.updatePaymasterReputation(paymaster, change, oldChangesExpirationBlock, eventBlockNumber);
    }
}
exports.ReputationManager = ReputationManager;
//# sourceMappingURL=ReputationManager.js.map