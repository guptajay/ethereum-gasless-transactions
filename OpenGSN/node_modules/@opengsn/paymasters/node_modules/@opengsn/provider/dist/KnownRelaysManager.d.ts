import { GsnTransactionDetails } from '@opengsn/common/dist/types/GsnTransactionDetails';
import { RelayFailureInfo } from '@opengsn/common/dist/types/RelayFailureInfo';
import { Address, AsyncScoreCalculator, RelayFilter } from '@opengsn/common/dist/types/Aliases';
import { GSNConfig } from './GSNConfigurator';
import { RelayInfoUrl, RelayRegisteredEventInfo } from '@opengsn/common/dist/types/GSNContractsDataTypes';
import { LoggerInterface } from '@opengsn/common/dist/LoggerInterface';
import { ContractInteractor } from '@opengsn/common/dist/ContractInteractor';
export declare const EmptyFilter: RelayFilter;
/**
 * Basic score is reversed transaction fee, higher is better.
 * Relays that failed to respond recently will be downgraded for some period of time.
 */
export declare const DefaultRelayScore: (relay: RelayRegisteredEventInfo, txDetails: GsnTransactionDetails, failures: RelayFailureInfo[]) => Promise<number>;
export declare class KnownRelaysManager {
    private readonly contractInteractor;
    private readonly logger;
    private readonly config;
    private readonly relayFilter;
    private readonly scoreCalculator;
    private latestScannedBlock;
    private relayFailures;
    preferredRelayers: RelayInfoUrl[];
    allRelayers: RelayInfoUrl[];
    constructor(contractInteractor: ContractInteractor, logger: LoggerInterface, config: GSNConfig, relayFilter?: RelayFilter, scoreCalculator?: AsyncScoreCalculator);
    refresh(): Promise<void>;
    getRelayInfoForManagers(relayManagers: Set<Address>): Promise<RelayRegisteredEventInfo[]>;
    _fetchRecentlyActiveRelayManagers(): Promise<Set<Address>>;
    _refreshFailures(): void;
    getRelaysSortedForTransaction(gsnTransactionDetails: GsnTransactionDetails): Promise<RelayInfoUrl[][]>;
    getAuditors(excludeUrls: string[]): string[];
    _sortRelaysInternal(gsnTransactionDetails: GsnTransactionDetails, activeRelays: RelayInfoUrl[]): Promise<RelayInfoUrl[]>;
    saveRelayFailure(lastErrorTime: number, relayManager: Address, relayUrl: string): void;
}
