import { PrefixedHexString } from 'ethereumjs-tx';
import { JsonRpcPayload } from 'web3-core-helpers';
import { WrapperProviderBase } from './WrapperProviderBase';
import { SendCallback } from './SendCallback';
import { HttpProvider } from 'web3-core';
export declare class NetworkSimulatingProvider extends WrapperProviderBase {
    private isDelayTransactionsOn;
    mempool: Map<string, JsonRpcPayload>;
    constructor(provider: HttpProvider);
    setDelayTransactions(delayTransactions: boolean): void;
    calculateTxHash(payload: JsonRpcPayload): PrefixedHexString;
    send(payload: JsonRpcPayload, callback: SendCallback): void;
    supportsSubscriptions(): boolean;
    mineTransaction(txHash: PrefixedHexString): Promise<any>;
}
