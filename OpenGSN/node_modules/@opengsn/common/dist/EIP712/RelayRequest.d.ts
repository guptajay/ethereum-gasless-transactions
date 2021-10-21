import { RelayData } from './RelayData';
import { ForwardRequest } from './ForwardRequest';
export interface RelayRequest {
    request: ForwardRequest;
    relayData: RelayData;
}
export declare function cloneRelayRequest(relayRequest: RelayRequest): RelayRequest;
