import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Web3ProviderBaseInterface } from './types/Aliases';
export declare class Contract<T> {
    readonly contractName: string;
    readonly abi: AbiItem[];
    web3: Web3;
    constructor(contractName: string, abi: AbiItem[]);
    createContract(address: string): any;
    at(address: string): Promise<T>;
    setProvider(provider: Web3ProviderBaseInterface, _: unknown): void;
}
export declare function TruffleContract({ contractName, abi }: {
    contractName: string;
    abi: any[];
}): any;
