import { EventData } from 'web3-eth-contract';
import { ContractInteractor } from '../ContractInteractor';
import { HttpClient } from '../HttpClient';
import { Address, EventName, ObjectMap, SemVerString } from '../types/Aliases';
import { GNSContractsEvent, StakeChangeEvent } from '../types/GSNContractsDataTypes';
import { EventTransactionInfo, GSNStatistics, PaymasterInfo, PingResult, RecipientInfo, RelayHubConstructorParams, RelayServerInfo, RelayServerStakeStatus, SenderInfo, StakeMangerEvents } from '../types/GSNStatistics';
import { LoggerInterface } from '../LoggerInterface';
export declare class StatisticsManager {
    private readonly contractInteractor;
    private readonly httpClient;
    private readonly logger;
    private allStakeManagerEvents;
    private allRelayHubEvents;
    constructor(contractInteractor: ContractInteractor, httpClient: HttpClient, logger: LoggerInterface);
    gatherStatistics(): Promise<GSNStatistics>;
    fetchRelayHubEvents(): Promise<void>;
    getSendersInfo(): Promise<SenderInfo[]>;
    getRecipientsInfo(): Promise<RecipientInfo[]>;
    getPaymastersInfo(): Promise<PaymasterInfo[]>;
    extractUnique(events: Array<EventTransactionInfo<StakeChangeEvent>>): Address[];
    getRelaysStakeStatus(): Array<{
        address: Address;
        status: RelayServerStakeStatus;
    }>;
    getRelayServersInfo(): Promise<RelayServerInfo[]>;
    gatherRelayInfo(managerAddress: Address, stakeStatus: RelayServerStakeStatus): Promise<RelayServerInfo>;
    getStakeManagerEvents(managerAddress?: Address): StakeMangerEvents;
    fetchStakeManagerEvents(): Promise<void>;
    attemptPing(url: string): Promise<PingResult>;
    extractTransactionInfos<T extends GNSContractsEvent>(eventsData: EventData[], eventName: EventName): Array<EventTransactionInfo<T>>;
    getAuthorizedHubsAndVersions(stakeManagerEvents: StakeMangerEvents): Promise<ObjectMap<SemVerString>>;
    getRelayHubConstructorParams(): Promise<RelayHubConstructorParams>;
}
