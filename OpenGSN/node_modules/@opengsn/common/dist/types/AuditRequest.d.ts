import { PrefixedHexString } from 'ethereumjs-tx';
export interface AuditRequest {
    signedTx: PrefixedHexString;
}
export interface AuditResponse {
    commitTxHash?: PrefixedHexString;
    message?: string;
}
export declare const AuditRequestShape: {
    signedTx: import("ow/dist/source").StringPredicate;
};
