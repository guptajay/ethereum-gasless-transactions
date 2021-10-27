"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nedb_async_1 = __importDefault(require("nedb-async"));
exports.REPUTATION_STORE_FILENAME = 'reputation_store.db';
class ReputationStoreManager {
    constructor({ workdir = '/tmp/test/', inMemory = false }, logger) {
        this.logger = logger;
        const filename = inMemory ? undefined : `${workdir}/${exports.REPUTATION_STORE_FILENAME}`;
        this.txstore = new nedb_async_1.default({
            filename,
            autoload: true,
            timestampData: true
        });
        this.txstore.ensureIndex({ fieldName: 'paymaster', unique: true });
        const dbLocationStr = inMemory ? 'memory' : `${workdir}/${exports.REPUTATION_STORE_FILENAME}`;
        this.logger.info(`Reputation system database location: ${dbLocationStr}`);
    }
    async createEntry(paymaster, reputation) {
        const entry = {
            paymaster: paymaster.toLowerCase(),
            reputation,
            lastAcceptedRelayRequestTs: 0,
            abuseStartedBlock: 0,
            changes: []
        };
        return await this.txstore.asyncInsert(entry);
    }
    async clearAbuseFlag(paymaster, reputation) {
        const update = {
            reputation,
            abuseStartedBlock: 0
        };
        await this.updateEntry(paymaster, update);
    }
    async setAbuseFlag(paymaster, eventBlockNumber) {
        const update = {
            abuseStartedBlock: eventBlockNumber
        };
        this.logger.warn(`Paymaster ${paymaster} was flagged as abused`);
        await this.updateEntry(paymaster, update);
    }
    async updateLastAcceptedTimestamp(paymaster) {
        const lastAcceptedRelayRequestTs = Date.now();
        const update = {
            lastAcceptedRelayRequestTs
        };
        this.logger.debug(`Paymaster ${paymaster} was last accepted at ${lastAcceptedRelayRequestTs}`);
        await this.updateEntry(paymaster, update);
    }
    async updatePaymasterReputation(paymaster, change, oldChangesExpirationBlock, eventBlockNumber) {
        if (eventBlockNumber <= oldChangesExpirationBlock) {
            throw new Error(`Invalid change expiration parameter! Passed ${oldChangesExpirationBlock}, but event was emitted at block height ${eventBlockNumber}`);
        }
        const existing = await this.txstore.asyncFindOne({ paymaster: paymaster.toLowerCase() });
        const reputationChange = {
            blockNumber: eventBlockNumber,
            change
        };
        const reputation = existing.reputation + change;
        const changes = [...existing.changes, reputationChange]
            .filter(it => it.blockNumber > oldChangesExpirationBlock);
        const update = {
            reputation,
            changes
        };
        this.logger.info(`Paymaster ${paymaster} reputation changed from ${existing.reputation} to ${reputation}. Change is ${change}`);
        await this.updateEntry(paymaster, update);
    }
    async updateEntry(paymaster, update) {
        const existing = await this.txstore.asyncFindOne({ paymaster: paymaster.toLowerCase() });
        const entry = Object.assign({}, existing, update);
        await this.txstore.asyncUpdate({ paymaster: existing.paymaster }, { $set: entry });
    }
    async getEntry(paymaster) {
        return await this.txstore.asyncFindOne({ paymaster: paymaster.toLowerCase() });
    }
    async clearAll() {
        await this.txstore.asyncRemove({}, { multi: true });
    }
}
exports.ReputationStoreManager = ReputationStoreManager;
//# sourceMappingURL=ReputationStoreManager.js.map