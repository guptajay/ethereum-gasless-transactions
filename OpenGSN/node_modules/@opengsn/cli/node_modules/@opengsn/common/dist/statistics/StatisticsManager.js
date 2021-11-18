"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../Utils");
const GSNContractsDataTypes_1 = require("../types/GSNContractsDataTypes");
const GSNStatistics_1 = require("../types/GSNStatistics");
const Version_1 = require("../Version");
class StatisticsManager {
    constructor(contractInteractor, httpClient, logger) {
        this.contractInteractor = contractInteractor;
        this.httpClient = httpClient;
        this.logger = logger;
    }
    async gatherStatistics() {
        const chainId = this.contractInteractor.chainId;
        const blockNumber = await this.contractInteractor.getBlockNumber();
        const relayHubConstructorParams = await this.getRelayHubConstructorParams();
        const stakeManagerAddress = this.contractInteractor.stakeManagerAddress();
        const totalStakesByRelays = await this.contractInteractor.getBalance(stakeManagerAddress);
        await this.fetchStakeManagerEvents();
        await this.fetchRelayHubEvents();
        const relayServers = await this.getRelayServersInfo();
        const paymasters = await this.getPaymastersInfo();
        const senders = await this.getSendersInfo();
        const recipients = await this.getRecipientsInfo();
        const totalGasPaidViaGSN = '0';
        const runtimeVersion = Version_1.gsnRuntimeVersion;
        const contractsDeployment = this.contractInteractor.getDeployment();
        const deploymentVersions = await this.contractInteractor.resolveDeploymentVersions();
        const deploymentBalances = await this.contractInteractor.queryDeploymentBalances();
        return {
            relayHubEvents: this.allRelayHubEvents,
            stakeManagerEvents: this.allStakeManagerEvents,
            relayHubConstructorParams,
            deploymentBalances,
            chainId,
            runtimeVersion,
            deploymentVersions,
            contractsDeployment,
            blockNumber,
            totalStakesByRelays,
            paymasters,
            senders,
            recipients,
            relayServers,
            totalGasPaidViaGSN
        };
    }
    async fetchRelayHubEvents() {
        const transactionDepositedEventsData = await this.contractInteractor.getPastEventsForHub([], { fromBlock: 1 }, [GSNContractsDataTypes_1.Deposited]);
        const depositedEvents = this.extractTransactionInfos(transactionDepositedEventsData, GSNContractsDataTypes_1.Deposited);
        const relayRegisteredEventsData = await this.contractInteractor.getPastEventsForHub([], { fromBlock: 1 }, [GSNContractsDataTypes_1.RelayServerRegistered]);
        const relayRegisteredEvents = this.extractTransactionInfos(relayRegisteredEventsData, GSNContractsDataTypes_1.RelayServerRegistered);
        const transactionRelayedEventsData = await this.contractInteractor.getPastEventsForHub([], { fromBlock: 1 }, [GSNContractsDataTypes_1.TransactionRelayed]);
        const transactionRelayedEvents = this.extractTransactionInfos(transactionRelayedEventsData, GSNContractsDataTypes_1.TransactionRelayed);
        const transactionRejectedEventsData = await this.contractInteractor.getPastEventsForHub([], { fromBlock: 1 }, [GSNContractsDataTypes_1.TransactionRejectedByPaymaster]);
        const transactionRejectedEvents = this.extractTransactionInfos(transactionRejectedEventsData, GSNContractsDataTypes_1.TransactionRejectedByPaymaster);
        this.allRelayHubEvents = {
            depositedEvents,
            relayRegisteredEvents,
            transactionRelayedEvents,
            transactionRejectedEvents
        };
    }
    // TODO
    async getSendersInfo() {
        return [];
    }
    // TODO
    async getRecipientsInfo() {
        return [];
    }
    async getPaymastersInfo() {
        var _a;
        const paymasters = new Set();
        for (const depositedEventInfo of (_a = this.allRelayHubEvents.depositedEvents) !== null && _a !== void 0 ? _a : []) {
            paymasters.add(depositedEventInfo.returnValues.paymaster);
        }
        const paymasterInfos = [];
        for (const address of paymasters) {
            const relayHubBalance = (await this.contractInteractor.hubBalanceOf(address)).toString();
            const acceptedTransactionsCount = this.allRelayHubEvents.transactionRelayedEvents.filter(it => Utils_1.isSameAddress(it.returnValues.paymaster, address)).length;
            const rejectedTransactionsCount = this.allRelayHubEvents.transactionRejectedEvents.filter(it => Utils_1.isSameAddress(it.returnValues.paymaster, address)).length;
            paymasterInfos.push({
                address,
                relayHubBalance,
                acceptedTransactionsCount,
                rejectedTransactionsCount
            });
        }
        return paymasterInfos;
    }
    extractUnique(events) {
        const set = new Set();
        events.forEach(it => {
            set.add(it.returnValues.relayManager);
        });
        return Array.from(set);
    }
    getRelaysStakeStatus() {
        const allEverStakedRelays = this.extractUnique(this.allStakeManagerEvents.stakeAddedEvents);
        const allEverUnlockedRelays = this.extractUnique(this.allStakeManagerEvents.stakeUnlockedEvents);
        const allCurrentlyWithdrawnRelays = this.extractUnique(this.allStakeManagerEvents.stakeWithdrawnEvents);
        const allCurrentlyPenalizedRelays = this.extractUnique(this.allStakeManagerEvents.stakePenalizedEvents);
        const allCurrentlyUnlockedRelays = new Set([...allEverUnlockedRelays]
            .filter(it => !allCurrentlyWithdrawnRelays.includes(it))
            .filter(it => !allCurrentlyPenalizedRelays.includes(it)));
        const allCurrentlyStakedRelays = new Set([...allEverStakedRelays]
            .filter(it => !allEverUnlockedRelays.includes(it))
            .filter(it => !allCurrentlyPenalizedRelays.includes(it)));
        return [
            ...Array.from(allCurrentlyStakedRelays).map(address => {
                return {
                    address,
                    status: GSNStatistics_1.RelayServerStakeStatus.STAKE_LOCKED
                };
            }),
            ...Array.from(allCurrentlyUnlockedRelays).map(address => {
                return {
                    address,
                    status: GSNStatistics_1.RelayServerStakeStatus.STAKE_UNLOCKED
                };
            }),
            ...Array.from(allCurrentlyWithdrawnRelays).map(address => {
                return {
                    address,
                    status: GSNStatistics_1.RelayServerStakeStatus.STAKE_WITHDRAWN
                };
            }),
            ...Array.from(allCurrentlyPenalizedRelays).map(address => {
                return {
                    address,
                    status: GSNStatistics_1.RelayServerStakeStatus.STAKE_PENALIZED
                };
            })
        ];
    }
    async getRelayServersInfo() {
        const relayServersInfo = [];
        const relaysByStatus = this.getRelaysStakeStatus();
        for (const relay of relaysByStatus) {
            relayServersInfo.push(this.gatherRelayInfo(relay.address, relay.status));
        }
        return await Promise.all(relayServersInfo);
    }
    async gatherRelayInfo(managerAddress, stakeStatus) {
        let registrationInfo;
        const stakeManagerEvents = await this.getStakeManagerEvents(managerAddress);
        const authorizedHubs = await this.getAuthorizedHubsAndVersions(stakeManagerEvents);
        const relayRegisteredEvents = this.allRelayHubEvents.relayRegisteredEvents.filter(it => it.returnValues.relayManager === managerAddress);
        const transactionRelayedEvents = this.allRelayHubEvents.transactionRelayedEvents.filter(it => it.returnValues.relayManager === managerAddress);
        const transactionRejectedEvents = this.allRelayHubEvents.transactionRejectedEvents.filter(it => it.returnValues.relayManager === managerAddress);
        const relayHubEvents = {
            relayRegisteredEvents,
            transactionRelayedEvents,
            transactionRejectedEvents
        };
        const isRegistered = stakeStatus === GSNStatistics_1.RelayServerStakeStatus.STAKE_LOCKED && relayRegisteredEvents.length !== 0;
        const relayHubEarningsBalance = (await this.contractInteractor.hubBalanceOf(managerAddress)).toString();
        const stakeInfo = await this.contractInteractor.stakeManagerStakeInfo(managerAddress);
        const ownerBalance = await this.contractInteractor.getBalance(stakeInfo.owner);
        const managerBalance = await this.contractInteractor.getBalance(managerAddress);
        if (isRegistered) {
            const lastRegisteredUrl = relayRegisteredEvents[relayRegisteredEvents.length - 1].returnValues.relayUrl;
            const lastRegisteredBaseFee = relayRegisteredEvents[relayRegisteredEvents.length - 1].returnValues.baseRelayFee;
            const lastRegisteredPctFee = relayRegisteredEvents[relayRegisteredEvents.length - 1].returnValues.pctRelayFee;
            const pingResult = await this.attemptPing(lastRegisteredUrl);
            const registeredWorkers = await this.contractInteractor.getRegisteredWorkers(managerAddress);
            const workerBalances = {};
            for (const worker of registeredWorkers) {
                workerBalances[worker] = await this.contractInteractor.getBalance(worker);
            }
            registrationInfo = {
                pingResult,
                workerBalances,
                lastRegisteredUrl,
                lastRegisteredBaseFee,
                lastRegisteredPctFee,
                registeredWorkers
            };
        }
        return {
            ownerBalance,
            managerBalance,
            stakeStatus,
            isRegistered,
            authorizedHubs,
            managerAddress,
            stakeInfo,
            relayHubEarningsBalance,
            relayHubEvents,
            registrationInfo,
            stakeManagerEvents
        };
    }
    getStakeManagerEvents(managerAddress) {
        const stakeAddedEvents = this.allStakeManagerEvents.stakeAddedEvents.filter(it => it.returnValues.relayManager === managerAddress);
        const stakeUnlockedEvents = this.allStakeManagerEvents.stakeUnlockedEvents.filter(it => it.returnValues.relayManager === managerAddress);
        const stakeWithdrawnEvents = this.allStakeManagerEvents.stakeWithdrawnEvents.filter(it => it.returnValues.relayManager === managerAddress);
        const stakePenalizedEvents = this.allStakeManagerEvents.stakePenalizedEvents.filter(it => it.returnValues.relayManager === managerAddress);
        const hubAuthorizedEvents = this.allStakeManagerEvents.hubAuthorizedEvents.filter(it => it.returnValues.relayManager === managerAddress);
        const hubUnauthorizedEvents = this.allStakeManagerEvents.hubUnauthorizedEvents.filter(it => it.returnValues.relayManager === managerAddress);
        const allEvents = this.allStakeManagerEvents.allEvents.filter(it => it.returnValues.relayManager === managerAddress);
        return {
            allEvents,
            stakeAddedEvents,
            stakeUnlockedEvents,
            stakeWithdrawnEvents,
            stakePenalizedEvents,
            hubAuthorizedEvents,
            hubUnauthorizedEvents
        };
    }
    async fetchStakeManagerEvents() {
        const allEvents = await this.contractInteractor.getPastEventsForStakeManager(GSNContractsDataTypes_1.allStakeManagerEvents, [], { fromBlock: 1 });
        const stakeAddedEvents = this.extractTransactionInfos(allEvents, GSNContractsDataTypes_1.StakeAdded);
        const stakeUnlockedEvents = this.extractTransactionInfos(allEvents, GSNContractsDataTypes_1.StakeUnlocked);
        const stakeWithdrawnEvents = this.extractTransactionInfos(allEvents, GSNContractsDataTypes_1.StakeWithdrawn);
        const stakePenalizedEvents = this.extractTransactionInfos(allEvents, GSNContractsDataTypes_1.StakePenalized);
        const hubAuthorizedEvents = this.extractTransactionInfos(allEvents, GSNContractsDataTypes_1.HubAuthorized);
        const hubUnauthorizedEvents = this.extractTransactionInfos(allEvents, GSNContractsDataTypes_1.HubUnauthorized);
        this.allStakeManagerEvents = {
            allEvents,
            stakeAddedEvents,
            stakeUnlockedEvents,
            stakeWithdrawnEvents,
            stakePenalizedEvents,
            hubAuthorizedEvents,
            hubUnauthorizedEvents
        };
    }
    async attemptPing(url) {
        let relayPing;
        try {
            const pingResponse = await this.httpClient.getPingResponse(url);
            relayPing = { pingResponse };
        }
        catch (error) {
            relayPing = { error };
        }
        return relayPing;
    }
    extractTransactionInfos(eventsData, eventName) {
        return eventsData
            .filter(eventData => eventData.event === eventName)
            .map(eventData => {
            return {
                eventData,
                returnValues: eventData.returnValues
            };
        });
    }
    async getAuthorizedHubsAndVersions(stakeManagerEvents) {
        const authorizedHubs = new Set();
        const orderedEvents = stakeManagerEvents.allEvents
            .filter(it => it.event === GSNContractsDataTypes_1.HubAuthorized || it.event === GSNContractsDataTypes_1.HubUnauthorized)
            .sort(Utils_1.eventsComparator);
        for (const eventData of orderedEvents) {
            if (eventData.event === GSNContractsDataTypes_1.HubAuthorized) {
                authorizedHubs.add(eventData.returnValues.relayHub);
            }
            else if (eventData.event === GSNContractsDataTypes_1.HubUnauthorized) {
                authorizedHubs.delete(eventData.returnValues.relayHub);
            }
        }
        const versionsMap = {};
        for (const hub of authorizedHubs) {
            try {
                const hubInstance = await this.contractInteractor._createRelayHub(hub);
                versionsMap[hub] = await hubInstance.versionHub();
            }
            catch (e) {
                versionsMap[hub] = 'Failed to query';
            }
        }
        return versionsMap;
    }
    async getRelayHubConstructorParams() {
        const hubConfig = await this.contractInteractor.relayHubInstance.getConfiguration();
        return {
            maxWorkerCount: hubConfig.maxWorkerCount.toString(),
            gasReserve: hubConfig.gasReserve.toString(),
            postOverhead: hubConfig.postOverhead.toString(),
            gasOverhead: hubConfig.gasOverhead.toString(),
            maximumRecipientDeposit: hubConfig.maximumRecipientDeposit.toString(),
            minimumUnstakeDelay: hubConfig.minimumUnstakeDelay.toString(),
            minimumStake: hubConfig.minimumStake.toString()
        };
    }
}
exports.StatisticsManager = StatisticsManager;
//# sourceMappingURL=StatisticsManager.js.map