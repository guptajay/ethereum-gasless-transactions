import { HttpProvider } from 'web3-core';
import { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers';
import { PrefixedHexString, Transaction } from 'ethereumjs-tx';
import { LoggerInterface } from '@opengsn/common/dist/LoggerInterface';
import { AccountKeypair } from './AccountManager';
import { GsnEvent } from './GsnEvents';
import { GSNUnresolvedConstructorInput, RelayClient } from './RelayClient';
import { GSNConfig } from './GSNConfigurator';
import { Web3ProviderBaseInterface } from '@opengsn/common/dist/types/Aliases';
export interface BaseTransactionReceipt {
    logs: any[];
    status: string | boolean;
}
export declare type JsonRpcCallback = (error: Error | null, result?: JsonRpcResponse) => void;
interface ISendAsync {
    sendAsync?: any;
}
export declare class RelayProvider implements HttpProvider, Web3ProviderBaseInterface {
    protected readonly origProvider: HttpProvider & ISendAsync;
    private readonly origProviderSend;
    protected config: GSNConfig;
    readonly relayClient: RelayClient;
    logger: LoggerInterface;
    static newProvider(input: GSNUnresolvedConstructorInput): RelayProvider;
    constructor(relayClient: RelayClient);
    init(): Promise<this>;
    registerEventListener(handler: (event: GsnEvent) => void): void;
    unregisterEventListener(handler: (event: GsnEvent) => void): void;
    _delegateEventsApi(): void;
    send(payload: JsonRpcPayload, callback: JsonRpcCallback): void;
    _ethGetTransactionReceipt(payload: JsonRpcPayload, callback: JsonRpcCallback): void;
    _ethSendTransaction(payload: JsonRpcPayload, callback: JsonRpcCallback): void;
    _convertTransactionToRpcSendResponse(transaction: Transaction, request: JsonRpcPayload): JsonRpcResponse;
    _getTranslatedGsnResponseResult(respResult: BaseTransactionReceipt): BaseTransactionReceipt;
    _useGSN(payload: JsonRpcPayload): boolean;
    host: string;
    connected: boolean;
    supportsSubscriptions(): boolean;
    disconnect(): boolean;
    newAccount(): AccountKeypair;
    addAccount(privateKey: PrefixedHexString): void;
    _getAccounts(payload: JsonRpcPayload, callback: JsonRpcCallback): void;
}
export {};
