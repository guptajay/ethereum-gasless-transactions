import { HttpProvider } from 'web3-core';
import { SendCallback } from './SendCallback';
import { JsonRpcPayload } from 'web3-core-helpers';
export declare abstract class WrapperProviderBase implements HttpProvider {
    provider: HttpProvider;
    protected constructor(provider: HttpProvider);
    get connected(): boolean;
    get host(): string;
    disconnect(): boolean;
    abstract send(payload: JsonRpcPayload, callback: SendCallback): void;
    supportsSubscriptions(): boolean;
}
