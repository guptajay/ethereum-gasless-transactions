"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** IPenalizer.sol */
exports.CommitAdded = 'CommitAdded';
/** IRelayHub.sol */
exports.RelayServerRegistered = 'RelayServerRegistered';
exports.RelayWorkersAdded = 'RelayWorkersAdded';
exports.TransactionRejectedByPaymaster = 'TransactionRejectedByPaymaster';
exports.TransactionRelayed = 'TransactionRelayed';
exports.Deposited = 'Deposited';
/**
 * Emitting any of these events is handled by GSN clients as a sign of activity by a RelayServer.
 */
exports.ActiveManagerEvents = [exports.RelayServerRegistered, exports.RelayWorkersAdded, exports.TransactionRelayed, exports.TransactionRejectedByPaymaster];
function isInfoFromEvent(info) {
    return 'relayManager' in info && 'baseRelayFee' in info && 'pctRelayFee' in info;
}
exports.isInfoFromEvent = isInfoFromEvent;
/** IStakeManager.sol */
exports.HubAuthorized = 'HubAuthorized';
exports.HubUnauthorized = 'HubUnauthorized';
exports.StakeAdded = 'StakeAdded';
exports.StakePenalized = 'StakePenalized';
exports.StakeUnlocked = 'StakeUnlocked';
exports.StakeWithdrawn = 'StakeWithdrawn';
exports.OwnerSet = 'OwnerSet';
exports.allStakeManagerEvents = [exports.StakeAdded, exports.HubAuthorized, exports.HubUnauthorized, exports.StakeUnlocked, exports.StakeWithdrawn, exports.StakePenalized];
//# sourceMappingURL=GSNContractsDataTypes.js.map