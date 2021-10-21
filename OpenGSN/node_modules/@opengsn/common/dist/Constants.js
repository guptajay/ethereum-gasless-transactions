"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = __importDefault(require("bn.js"));
const web3_utils_1 = require("web3-utils");
const dayInSec = 24 * 60 * 60;
const weekInSec = dayInSec * 7;
const oneEther = web3_utils_1.toBN(1e18);
exports.constants = {
    dayInSec,
    weekInSec,
    oneEther,
    ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
    ZERO_BYTES32: '0x0000000000000000000000000000000000000000000000000000000000000000',
    MAX_UINT256: new bn_js_1.default('2').pow(new bn_js_1.default('256')).sub(new bn_js_1.default('1')),
    MAX_INT256: new bn_js_1.default('2').pow(new bn_js_1.default('255')).sub(new bn_js_1.default('1')),
    MIN_INT256: new bn_js_1.default('2').pow(new bn_js_1.default('255')).mul(new bn_js_1.default('-1'))
};
//# sourceMappingURL=Constants.js.map