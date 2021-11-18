"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class GasPriceFetcher {
    constructor(gasPriceOracleUrl, gasPriceOraclePath, contractInteractor, logger) {
        this.gasPriceOracleUrl = gasPriceOracleUrl;
        this.gasPriceOraclePath = gasPriceOraclePath;
        this.contractInteractor = contractInteractor;
        this.logger = logger;
    }
    // equivalent to `eval("blob"+path)` - but without evil eval
    // path is sequence of `.word` , `[number]`, `["string"]`
    getJsonElement(blob, path, origPath = path) {
        var _a, _b;
        const m = path.match(/^\.(\w+)|\["([^"]+)"\]|\[(\d+)\]/);
        if (m == null)
            throw new Error(`invalid path: ${origPath}: head of ${path}`);
        const rest = path.slice(m[0].length);
        const subitem = (_b = (_a = m[1]) !== null && _a !== void 0 ? _a : m[2]) !== null && _b !== void 0 ? _b : m[3];
        const sub = blob[subitem];
        if (sub == null) {
            return null;
        }
        if (rest === '') {
            return sub;
        }
        return this.getJsonElement(sub, rest, origPath);
    }
    async getGasPrice() {
        var _a;
        if (this.gasPriceOracleUrl !== '') {
            try {
                const res = await axios_1.default.get(this.gasPriceOracleUrl, { timeout: 2000 });
                const ret = parseFloat((_a = this.getJsonElement(res.data, this.gasPriceOraclePath)) !== null && _a !== void 0 ? _a : '');
                if (typeof ret !== 'number' || isNaN(ret)) {
                    throw new Error(`not a number: ${ret}`);
                }
                return (ret * 1e9).toString();
            }
            catch (e) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                this.logger.error(`failed to access gas oracle. using getGasPrice() instead.\n(url=${this.gasPriceOracleUrl} path=${this.gasPriceOraclePath} err: ${e.message})`);
            }
        }
        return await this.contractInteractor.getGasPrice();
    }
}
exports.GasPriceFetcher = GasPriceFetcher;
//# sourceMappingURL=GasPriceFetcher.js.map