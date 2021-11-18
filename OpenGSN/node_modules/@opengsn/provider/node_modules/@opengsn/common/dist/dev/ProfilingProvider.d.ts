import { HttpProvider } from 'web3-core';
import { JsonRpcPayload } from 'web3-core-helpers';
import { SendCallback } from './SendCallback';
import { WrapperProviderBase } from './WrapperProviderBase';
export declare class ProfilingProvider extends WrapperProviderBase {
    methodsCount: Map<string, number>;
    requestsCount: number;
    logTraffic: boolean;
    constructor(provider: HttpProvider, logTraffic?: boolean);
    disconnect(): boolean;
    supportsSubscriptions(): boolean;
    send(payload: JsonRpcPayload, callback: SendCallback): void;
    reset(): void;
    log(): void;
}
