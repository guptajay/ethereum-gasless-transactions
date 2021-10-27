import { LoggerInterface } from '@opengsn/common/dist/LoggerInterface';
import { AccountManager } from './AccountManager';
import { ContractInteractor } from '@opengsn/common/dist/ContractInteractor';
import { HttpClient } from '@opengsn/common/dist/HttpClient';
import { KnownRelaysManager } from './KnownRelaysManager';
import { RelayedTransactionValidator } from './RelayedTransactionValidator';
import { Address, AsyncDataCallback, AsyncScoreCalculator, IntString, NpmLogLevel, PingFilter, RelayFilter } from '@opengsn/common/dist/types/Aliases';
export declare const defaultLoggerConfiguration: LoggerConfiguration;
export declare const defaultGsnConfig: GSNConfig;
export interface LoggerConfiguration {
    logLevel: NpmLogLevel;
    loggerUrl?: string;
    userId?: string;
    applicationId?: string;
}
/**
 * @field methodSuffix - allows use of versioned methods, i.e. 'eth_signTypedData_v4'. Should be '_v4' for Metamask
 * @field jsonStringifyRequest - should be 'true' for Metamask, false for ganache
 */
export interface GSNConfig {
    preferredRelays: string[];
    relayLookupWindowBlocks: number;
    relayRegistrationLookupBlocks: number;
    pastEventsQueryMaxPageSize: number;
    methodSuffix: string;
    jsonStringifyRequest: boolean;
    requiredVersionRange?: string;
    relayTimeoutGrace: number;
    sliceSize: number;
    loggerConfiguration?: LoggerConfiguration;
    gasPriceFactorPercent: number;
    gasPriceOracleUrl: string;
    gasPriceOraclePath: string;
    minGasPrice: number;
    maxRelayNonceGap: number;
    paymasterAddress?: Address;
    clientId: IntString;
    auditorsCount: number;
    maxViewableGasLimit?: number;
}
export interface GSNDependencies {
    httpClient: HttpClient;
    logger: LoggerInterface;
    contractInteractor: ContractInteractor;
    knownRelaysManager: KnownRelaysManager;
    accountManager: AccountManager;
    transactionValidator: RelayedTransactionValidator;
    pingFilter: PingFilter;
    relayFilter: RelayFilter;
    asyncApprovalData: AsyncDataCallback;
    asyncPaymasterData: AsyncDataCallback;
    scoreCalculator: AsyncScoreCalculator;
}
