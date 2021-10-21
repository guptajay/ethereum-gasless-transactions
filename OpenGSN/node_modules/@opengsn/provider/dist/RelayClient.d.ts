/// <reference types="node" />
import { EventEmitter } from 'events';
import { PrefixedHexString, Transaction } from 'ethereumjs-tx';
import { GsnTransactionDetails } from '@opengsn/common/dist/types/GsnTransactionDetails';
import { AsyncDataCallback, PingFilter, Web3ProviderBaseInterface } from '@opengsn/common/dist/types/Aliases';
import { AuditResponse } from '@opengsn/common/dist/types/AuditRequest';
import { LoggerInterface } from '@opengsn/common/dist/LoggerInterface';
import { RelayInfo } from '@opengsn/common/dist/types/RelayInfo';
import { RelayTransactionRequest } from '@opengsn/common/dist/types/RelayTransactionRequest';
import { AccountKeypair } from './AccountManager';
import { GSNConfig, GSNDependencies } from './GSNConfigurator';
import { GsnEvent } from './GsnEvents';
export declare const EmptyDataCallback: AsyncDataCallback;
export declare const GasPricePingFilter: PingFilter;
export interface GSNUnresolvedConstructorInput {
    provider: Web3ProviderBaseInterface;
    config: Partial<GSNConfig>;
    overrideDependencies?: Partial<GSNDependencies>;
}
interface RelayingAttempt {
    transaction?: Transaction;
    error?: Error;
    auditPromise?: Promise<AuditResponse>;
}
export interface RelayingResult {
    transaction?: Transaction;
    pingErrors: Map<string, Error>;
    relayingErrors: Map<string, Error>;
    auditPromises?: Array<Promise<AuditResponse>>;
}
export declare class RelayClient {
    readonly emitter: EventEmitter;
    config: GSNConfig;
    dependencies: GSNDependencies;
    private readonly rawConstructorInput;
    private initialized;
    logger: LoggerInterface;
    initializingPromise?: Promise<void>;
    constructor(rawConstructorInput: GSNUnresolvedConstructorInput);
    init(): Promise<this>;
    _initInternal(): Promise<void>;
    /**
     * register a listener for GSN events
     * @see GsnEvent and its subclasses for emitted events
     * @param handler callback function to handle events
     */
    registerEventListener(handler: (event: GsnEvent) => void): void;
    /**
     * unregister previously registered event listener
     * @param handler callback function to unregister
     */
    unregisterEventListener(handler: (event: GsnEvent) => void): void;
    private emit;
    /**
     * In case Relay Server does not broadcast the signed transaction to the network,
     * client also broadcasts the same transaction. If the transaction fails with nonce
     * error, it indicates Relay may have signed multiple transactions with same nonce,
     * causing a DoS attack.
     *
     * @param {*} transaction - actual Ethereum transaction, signed by a relay
     */
    _broadcastRawTx(transaction: Transaction): Promise<{
        hasReceipt: boolean;
        broadcastError?: Error;
        wrongNonce?: boolean;
    }>;
    _isAlreadySubmitted(txHash: string): Promise<boolean>;
    relayTransaction(gsnTransactionDetails: GsnTransactionDetails): Promise<RelayingResult>;
    _warn(msg: string): void;
    _calculateGasPrice(): Promise<PrefixedHexString>;
    _attemptRelay(relayInfo: RelayInfo, gsnTransactionDetails: GsnTransactionDetails): Promise<RelayingAttempt>;
    _prepareRelayHttpRequest(relayInfo: RelayInfo, gsnTransactionDetails: GsnTransactionDetails): Promise<RelayTransactionRequest>;
    newAccount(): AccountKeypair;
    addAccount(privateKey: PrefixedHexString): void;
    _verifyInitialized(): void;
    auditTransaction(hexTransaction: PrefixedHexString, sourceRelayUrl: string): Promise<AuditResponse>;
    getUnderlyingProvider(): Web3ProviderBaseInterface;
    _resolveConfiguration({ provider, config }: GSNUnresolvedConstructorInput): Promise<GSNConfig>;
    _resolveDependencies({ provider, config, overrideDependencies }: GSNUnresolvedConstructorInput): Promise<GSNDependencies>;
}
export declare function _dumpRelayingResult(relayingResult: RelayingResult): string;
export {};
