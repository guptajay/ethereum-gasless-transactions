"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eth_sig_util_1 = require("eth-sig-util");
const ethereumjs_util_1 = require("ethereumjs-util");
const EIP712DomainType = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' }
];
const RelayDataType = [
    { name: 'gasPrice', type: 'uint256' },
    { name: 'pctRelayFee', type: 'uint256' },
    { name: 'baseRelayFee', type: 'uint256' },
    { name: 'relayWorker', type: 'address' },
    { name: 'paymaster', type: 'address' },
    { name: 'forwarder', type: 'address' },
    { name: 'paymasterData', type: 'bytes' },
    { name: 'clientId', type: 'uint256' }
];
const ForwardRequestType = [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'gas', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'data', type: 'bytes' },
    { name: 'validUntil', type: 'uint256' }
];
const RelayRequestType = [
    ...ForwardRequestType,
    { name: 'relayData', type: 'RelayData' }
];
// use these values in registerDomainSeparator
exports.GsnDomainSeparatorType = {
    prefix: 'string name,string version',
    name: 'GSN Relayed Transaction',
    version: '2'
};
function getDomainSeparator(verifier, chainId) {
    return {
        name: exports.GsnDomainSeparatorType.name,
        version: exports.GsnDomainSeparatorType.version,
        chainId: chainId,
        verifyingContract: verifier
    };
}
exports.getDomainSeparator = getDomainSeparator;
function getDomainSeparatorHash(verifier, chainId) {
    return ethereumjs_util_1.bufferToHex(eth_sig_util_1.TypedDataUtils.hashStruct('EIP712Domain', getDomainSeparator(verifier, chainId), { EIP712Domain: EIP712DomainType }));
}
exports.getDomainSeparatorHash = getDomainSeparatorHash;
class TypedRequestData {
    constructor(chainId, verifier, relayRequest) {
        this.types = {
            EIP712Domain: EIP712DomainType,
            RelayRequest: RelayRequestType,
            RelayData: RelayDataType
        };
        this.domain = getDomainSeparator(verifier, chainId);
        this.primaryType = 'RelayRequest';
        // in the signature, all "request" fields are flattened out at the top structure.
        // other params are inside "relayData" sub-type
        this.message = Object.assign(Object.assign({}, relayRequest.request), { relayData: relayRequest.relayData });
    }
}
exports.TypedRequestData = TypedRequestData;
exports.GsnRequestType = {
    typeName: 'RelayRequest',
    typeSuffix: 'RelayData relayData)RelayData(uint256 gasPrice,uint256 pctRelayFee,uint256 baseRelayFee,address relayWorker,address paymaster,address forwarder,bytes paymasterData,uint256 clientId)'
};
//# sourceMappingURL=TypedRequestData.js.map