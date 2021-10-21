"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("@opengsn/common/dist/Utils");
const GSNContractsDataTypes_1 = require("@opengsn/common/dist/types/GSNContractsDataTypes");
exports.EmptyFilter = () => {
    return true;
};
/**
 * Basic score is reversed transaction fee, higher is better.
 * Relays that failed to respond recently will be downgraded for some period of time.
 */
exports.DefaultRelayScore = async function (relay, txDetails, failures) {
    var _a, _b;
    const gasLimit = parseInt((_a = txDetails.gas) !== null && _a !== void 0 ? _a : '0');
    const gasPrice = parseInt((_b = txDetails.gasPrice) !== null && _b !== void 0 ? _b : '0');
    const pctFee = parseInt(relay.pctRelayFee);
    const baseFee = parseInt(relay.baseRelayFee);
    const transactionCost = baseFee + (gasLimit * gasPrice * (100 + pctFee)) / 100;
    let score = Math.max(Number.MAX_SAFE_INTEGER - transactionCost, 0);
    score = score * Math.pow(0.9, failures.length);
    return score;
};
class KnownRelaysManager {
    constructor(contractInteractor, logger, config, relayFilter, scoreCalculator) {
        this.latestScannedBlock = 0;
        this.relayFailures = new Map();
        this.preferredRelayers = [];
        this.allRelayers = [];
        this.config = config;
        this.logger = logger;
        this.relayFilter = relayFilter !== null && relayFilter !== void 0 ? relayFilter : exports.EmptyFilter;
        this.scoreCalculator = scoreCalculator !== null && scoreCalculator !== void 0 ? scoreCalculator : exports.DefaultRelayScore;
        this.contractInteractor = contractInteractor;
    }
    async refresh() {
        this._refreshFailures();
        const recentlyActiveRelayManagers = await this._fetchRecentlyActiveRelayManagers();
        this.preferredRelayers = this.config.preferredRelays.map(relayUrl => { return { relayUrl }; });
        this.allRelayers = await this.getRelayInfoForManagers(recentlyActiveRelayManagers);
    }
    async getRelayInfoForManagers(relayManagers) {
        // As 'topics' are used as 'filter', having an empty set results in querying all register events.
        if (relayManagers.size === 0) {
            return [];
        }
        const toBlock = await this.contractInteractor.getBlockNumber();
        const fromBlock = Math.max(0, toBlock - this.config.relayRegistrationLookupBlocks);
        const topics = Utils_1.addresses2topics(Array.from(relayManagers));
        const relayServerRegisteredEvents = await this.contractInteractor.getPastEventsForHub(topics, { fromBlock }, [GSNContractsDataTypes_1.RelayServerRegistered]);
        const relayManagerExitEvents = await this.contractInteractor.getPastEventsForStakeManager([GSNContractsDataTypes_1.StakeUnlocked, GSNContractsDataTypes_1.HubUnauthorized, GSNContractsDataTypes_1.StakePenalized], topics, { fromBlock });
        this.logger.info(`== getRelayInfoForManagers: found ${relayServerRegisteredEvents.length} unique RelayServerRegistered events`);
        if (relayServerRegisteredEvents.length === 0) {
            this.logger.error(`Did not find any RelayServerRegistered Event for any of ${relayManagers.size} relay managers! {fromBlock: ${fromBlock}, toBlock: ${toBlock}}`);
        }
        const mergedEvents = [...relayManagerExitEvents, ...relayServerRegisteredEvents].sort((a, b) => {
            const blockNumberA = a.blockNumber;
            const blockNumberB = b.blockNumber;
            const transactionIndexA = a.transactionIndex;
            const transactionIndexB = b.transactionIndex;
            if (blockNumberA === blockNumberB) {
                return transactionIndexA - transactionIndexB;
            }
            return blockNumberA - blockNumberB;
        });
        const activeRelays = new Map();
        mergedEvents.forEach(event => {
            const args = event.returnValues;
            if (event.event === GSNContractsDataTypes_1.RelayServerRegistered) {
                activeRelays.set(args.relayManager, args);
            }
            else {
                activeRelays.delete(args.relayManager);
            }
        });
        const origRelays = Array.from(activeRelays.values());
        return origRelays.filter(this.relayFilter);
    }
    async _fetchRecentlyActiveRelayManagers() {
        const toBlock = await this.contractInteractor.getBlockNumber();
        const fromBlock = Math.max(0, toBlock - this.config.relayLookupWindowBlocks);
        const relayEvents = await this.contractInteractor.getPastEventsForHub([], {
            fromBlock,
            toBlock
        }, undefined);
        this.logger.info(`fetchRelaysAdded: found ${relayEvents.length} events`);
        const foundRelayManagers = new Set();
        relayEvents.forEach((event) => {
            // TODO: remove relay managers who are not staked
            // if (event.event === 'RelayRemoved') {
            //   foundRelays.delete(event.returnValues.relay)
            // } else {
            foundRelayManagers.add(event.returnValues.relayManager);
        });
        this.logger.info(`fetchRelaysAdded: found unique relays: ${JSON.stringify(Array.from(foundRelayManagers.values()))}`);
        this.latestScannedBlock = toBlock;
        return foundRelayManagers;
    }
    _refreshFailures() {
        const newMap = new Map();
        this.relayFailures.forEach((value, key) => {
            newMap.set(key, value.filter(failure => {
                const elapsed = (new Date().getTime() - failure.lastErrorTime) / 1000;
                return elapsed < this.config.relayTimeoutGrace;
            }));
        });
        this.relayFailures = newMap;
    }
    async getRelaysSortedForTransaction(gsnTransactionDetails) {
        const sortedRelays = [];
        // preferred relays are copied as-is, unsorted (we don't have any info about them anyway to sort)
        sortedRelays[0] = Array.from(this.preferredRelayers);
        sortedRelays[1] = await this._sortRelaysInternal(gsnTransactionDetails, this.allRelayers);
        return sortedRelays;
    }
    getAuditors(excludeUrls) {
        const indexes = [];
        const auditors = [];
        const flatRelayers = [...this.preferredRelayers, ...this.allRelayers]
            .map(it => it.relayUrl)
            .filter(it => !excludeUrls.includes(it))
            .filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
        if (flatRelayers.length <= this.config.auditorsCount) {
            if (flatRelayers.length < this.config.auditorsCount) {
                this.logger.warn(`Not enough auditors: request ${this.config.auditorsCount} but only have ${flatRelayers.length}`);
            }
            return flatRelayers;
        }
        do {
            const index = Math.floor(Math.random() * flatRelayers.length);
            if (!indexes.includes(index)) {
                auditors.push(flatRelayers[index]);
                indexes.push(index);
            }
        } while (auditors.length < this.config.auditorsCount);
        return auditors;
    }
    async _sortRelaysInternal(gsnTransactionDetails, activeRelays) {
        var _a;
        const scores = new Map();
        for (const activeRelay of activeRelays) {
            let score = 0;
            if (GSNContractsDataTypes_1.isInfoFromEvent(activeRelay)) {
                const eventInfo = activeRelay;
                score = await this.scoreCalculator(eventInfo, gsnTransactionDetails, (_a = this.relayFailures.get(activeRelay.relayUrl)) !== null && _a !== void 0 ? _a : []);
                scores.set(eventInfo.relayManager, score);
            }
        }
        return Array
            .from(activeRelays.values())
            .filter(GSNContractsDataTypes_1.isInfoFromEvent)
            .map(value => value)
            .sort((a, b) => {
            var _a, _b;
            const aScore = (_a = scores.get(a.relayManager)) !== null && _a !== void 0 ? _a : 0;
            const bScore = (_b = scores.get(b.relayManager)) !== null && _b !== void 0 ? _b : 0;
            return bScore - aScore;
        });
    }
    saveRelayFailure(lastErrorTime, relayManager, relayUrl) {
        const relayFailures = this.relayFailures.get(relayUrl);
        const newFailureInfo = {
            lastErrorTime,
            relayManager,
            relayUrl
        };
        if (relayFailures == null) {
            this.relayFailures.set(relayUrl, [newFailureInfo]);
        }
        else {
            relayFailures.push(newFailureInfo);
        }
    }
}
exports.KnownRelaysManager = KnownRelaysManager;
//# sourceMappingURL=KnownRelaysManager.js.map