"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const ethval_1 = __importDefault(require("ethval"));
const web3_utils_1 = require("web3-utils");
const Utils_1 = require("./Utils");
class AmountRequired {
    constructor(name, requiredValue, logger, listener) {
        this._currentValue = web3_utils_1.toBN(0);
        this._requiredValue = web3_utils_1.toBN(0);
        this.logger = logger;
        this._name = name;
        this._requiredValue = requiredValue;
        this._listener = listener;
    }
    get currentValue() {
        return this._currentValue;
    }
    set currentValue(newValue) {
        const didChange = !this._currentValue.eq(newValue);
        const wasSatisfied = this.isSatisfied;
        this._currentValue = newValue;
        if (didChange) {
            this._onChange(wasSatisfied);
        }
    }
    get requiredValue() {
        return this._requiredValue;
    }
    set requiredValue(newValue) {
        const didChange = !this._requiredValue.eq(newValue);
        const wasSatisfied = this.isSatisfied;
        this._requiredValue = newValue;
        if (didChange) {
            this._onChange(wasSatisfied);
        }
    }
    _onChange(wasSatisfied) {
        let changeString;
        if (wasSatisfied === this.isSatisfied) {
            changeString = `still${this.isSatisfied ? '' : ' not'}`;
        }
        else if (this.isSatisfied) {
            changeString = 'now';
        }
        else {
            changeString = 'no longer';
        }
        const message = `${this._name} requirement is ${changeString} satisfied\n${this.description}`;
        this.logger.warn(message);
        if (this._listener != null) {
            this._listener();
        }
    }
    get isSatisfied() {
        return this._currentValue.gte(this._requiredValue);
    }
    get description() {
        const status = Utils_1.boolString(this.isSatisfied);
        const actual = new ethval_1.default(this._currentValue).toEth().toFixed(4);
        const required = new ethval_1.default(this._requiredValue).toEth().toFixed(4);
        return `${this._name.padEnd(14)} | ${status.padEnd(14)} | actual: ${actual.padStart(12)} ETH | required: ${required.padStart(12)} ETH`;
    }
}
exports.AmountRequired = AmountRequired;
//# sourceMappingURL=AmountRequired.js.map