import { PrefixedHexString } from 'ethereumjs-tx';
import { Address } from './Aliases';
import { RelayRequest } from '../EIP712/RelayRequest';
export interface RelayMetadata {
    approvalData: PrefixedHexString;
    relayHubAddress: Address;
    relayMaxNonce: number;
    signature: PrefixedHexString;
}
export interface RelayTransactionRequest {
    relayRequest: RelayRequest;
    metadata: RelayMetadata;
}
export declare const RelayTransactionRequestShape: {
    relayRequest: {
        request: {
            from: import("ow/dist/source").StringPredicate;
            to: import("ow/dist/source").StringPredicate;
            data: import("ow/dist/source").StringPredicate;
            value: import("ow/dist/source").StringPredicate;
            nonce: import("ow/dist/source").StringPredicate;
            gas: import("ow/dist/source").StringPredicate;
            validUntil: import("ow/dist/source").StringPredicate;
        };
        relayData: {
            gasPrice: import("ow/dist/source").StringPredicate;
            pctRelayFee: import("ow/dist/source").StringPredicate;
            baseRelayFee: import("ow/dist/source").StringPredicate;
            relayWorker: import("ow/dist/source").StringPredicate;
            paymaster: import("ow/dist/source").StringPredicate;
            paymasterData: import("ow/dist/source").StringPredicate;
            clientId: import("ow/dist/source").StringPredicate;
            forwarder: import("ow/dist/source").StringPredicate;
        };
    };
    metadata: {
        approvalData: import("ow/dist/source").StringPredicate;
        relayHubAddress: import("ow/dist/source").StringPredicate;
        relayMaxNonce: import("ow/dist/source").NumberPredicate;
        signature: import("ow/dist/source").StringPredicate;
    };
};
