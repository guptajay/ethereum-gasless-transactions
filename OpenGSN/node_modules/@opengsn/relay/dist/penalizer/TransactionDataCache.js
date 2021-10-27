"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nedb_async_1 = __importDefault(require("nedb-async"));
exports.TX_STORE_FILENAME = 'penalizetxcache.db';
exports.TX_PAGES_FILENAME = 'penalizetxpages.db';
class TransactionDataCache {
    constructor(logger, workdir) {
        const filename = `${workdir}/${exports.TX_STORE_FILENAME}`;
        this.logger = logger;
        this.txstore = new nedb_async_1.default({
            filename,
            autoload: true,
            timestampData: true
        });
        this.pagesStore = new nedb_async_1.default({
            filename: `${workdir}/${exports.TX_PAGES_FILENAME}`,
            autoload: true,
            timestampData: true
        });
        this.txstore.ensureIndex({ fieldName: 'hash', unique: true });
        this.pagesStore.ensureIndex({ fieldName: 'sender', unique: true });
        this.logger.info(`Penalizer cache database location: ${filename}`);
    }
    async putTransactions(transactions, sender, page) {
        const existing = await this.pagesStore.asyncFindOne({ sender });
        if (existing == null) {
            await this.pagesStore.asyncInsert({ sender, page });
        }
        else if (existing.page >= page) {
            throw new Error(`Trying to cache page ${page} when already have ${existing.page} pages for sender ${sender}`);
        }
        for (const transaction of transactions) {
            transaction.from = transaction.from.toLowerCase();
            await this.txstore.asyncInsert(transaction);
        }
    }
    async getLastPageQueried(sender) {
        const lastPageQueried = await this.pagesStore.asyncFindOne({ sender: sender.toLowerCase() });
        if (lastPageQueried == null) {
            return 0;
        }
        return lastPageQueried.page;
    }
    async getTransactionByNonce(address, nonce) {
        return await this.txstore.asyncFindOne({
            from: address.toLowerCase(),
            nonce: nonce.toString()
        });
    }
    async clearAll() {
        await this.txstore.asyncRemove({}, { multi: true });
        await this.pagesStore.asyncRemove({}, { multi: true });
    }
}
exports.TransactionDataCache = TransactionDataCache;
//# sourceMappingURL=TransactionDataCache.js.map