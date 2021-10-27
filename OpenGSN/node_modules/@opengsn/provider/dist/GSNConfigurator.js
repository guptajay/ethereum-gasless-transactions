"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GAS_PRICE_PERCENT = 20;
const MAX_RELAY_NONCE_GAP = 3;
const DEFAULT_RELAY_TIMEOUT_GRACE_SEC = 1800;
const DEFAULT_LOOKUP_WINDOW_BLOCKS = 60000;
exports.defaultLoggerConfiguration = {
    logLevel: 'info'
};
exports.defaultGsnConfig = {
    preferredRelays: [],
    relayLookupWindowBlocks: DEFAULT_LOOKUP_WINDOW_BLOCKS,
    relayRegistrationLookupBlocks: Number.MAX_SAFE_INTEGER,
    pastEventsQueryMaxPageSize: Number.MAX_SAFE_INTEGER,
    gasPriceFactorPercent: GAS_PRICE_PERCENT,
    gasPriceOracleUrl: '',
    gasPriceOraclePath: '',
    minGasPrice: 0,
    maxRelayNonceGap: MAX_RELAY_NONCE_GAP,
    sliceSize: 3,
    relayTimeoutGrace: DEFAULT_RELAY_TIMEOUT_GRACE_SEC,
    methodSuffix: '',
    requiredVersionRange: '2.2.0',
    jsonStringifyRequest: false,
    auditorsCount: 1,
    clientId: '1'
};
//# sourceMappingURL=GSNConfigurator.js.map