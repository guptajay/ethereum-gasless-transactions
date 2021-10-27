"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * With about 6000 blocks per day, maximum unstake delay is defined at around 5 years for the mainnet.
 * This is done to prevent mistakenly setting an unstake delay to millions of years.
 */
const defaultStakeManagerMaxUnstakeDelay = 10000000;
const defaultPenalizerConfiguration = {
    penalizeBlockDelay: 5,
    penalizeBlockExpiration: 60000
};
const defaultRelayHubConfiguration = {
    gasOverhead: 33135,
    postOverhead: 15066,
    gasReserve: 100000,
    maxWorkerCount: 10,
    minimumStake: 1e18.toString(),
    minimumUnstakeDelay: 1000,
    maximumRecipientDeposit: 2e18.toString(),
    dataGasCostPerByte: 13,
    externalCallDataCostOverhead: 22414
};
// TODO add as constructor params to paymaster instead of constants
const preRelayedCallGasLimit = 1e5;
const forwarderHubOverhead = 5e4;
const defaultPaymasterConfiguration = {
    forwarderHubOverhead: forwarderHubOverhead,
    preRelayedCallGasLimit: preRelayedCallGasLimit,
    postRelayedCallGasLimit: 11e4,
    acceptanceBudget: preRelayedCallGasLimit + forwarderHubOverhead,
    calldataSizeLimit: 10404
};
exports.environments = {
    istanbul: {
        chainId: 1,
        relayHubConfiguration: defaultRelayHubConfiguration,
        penalizerConfiguration: defaultPenalizerConfiguration,
        paymasterConfiguration: defaultPaymasterConfiguration,
        maxUnstakeDelay: defaultStakeManagerMaxUnstakeDelay,
        mintxgascost: 21000,
        gtxdatanonzero: 16,
        gtxdatazero: 4
    },
    constantinople: {
        chainId: 1,
        relayHubConfiguration: defaultRelayHubConfiguration,
        penalizerConfiguration: defaultPenalizerConfiguration,
        paymasterConfiguration: defaultPaymasterConfiguration,
        maxUnstakeDelay: defaultStakeManagerMaxUnstakeDelay,
        mintxgascost: 21000,
        gtxdatanonzero: 16,
        gtxdatazero: 4
    },
    ganacheLocal: {
        chainId: 1337,
        relayHubConfiguration: defaultRelayHubConfiguration,
        penalizerConfiguration: defaultPenalizerConfiguration,
        paymasterConfiguration: defaultPaymasterConfiguration,
        maxUnstakeDelay: defaultStakeManagerMaxUnstakeDelay,
        mintxgascost: 21000,
        gtxdatanonzero: 16,
        gtxdatazero: 4
    }
};
exports.defaultEnvironment = exports.environments.ganacheLocal;
//# sourceMappingURL=Environments.js.map