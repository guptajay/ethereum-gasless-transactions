"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RelayServerStakeStatus;
(function (RelayServerStakeStatus) {
    /** only staked, but never registered on currently selected RelayHub */
    RelayServerStakeStatus[RelayServerStakeStatus["STAKE_LOCKED"] = 0] = "STAKE_LOCKED";
    /** stake unlocked but not yet withdrawn */
    RelayServerStakeStatus[RelayServerStakeStatus["STAKE_UNLOCKED"] = 1] = "STAKE_UNLOCKED";
    /** stake withdrawn */
    RelayServerStakeStatus[RelayServerStakeStatus["STAKE_WITHDRAWN"] = 2] = "STAKE_WITHDRAWN";
    /** stake has been penalized */
    RelayServerStakeStatus[RelayServerStakeStatus["STAKE_PENALIZED"] = 3] = "STAKE_PENALIZED";
})(RelayServerStakeStatus = exports.RelayServerStakeStatus || (exports.RelayServerStakeStatus = {}));
//# sourceMappingURL=GSNStatistics.js.map