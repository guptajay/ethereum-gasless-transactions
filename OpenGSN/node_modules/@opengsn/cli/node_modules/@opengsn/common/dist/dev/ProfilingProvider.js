"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WrapperProviderBase_1 = require("./WrapperProviderBase");
class ProfilingProvider extends WrapperProviderBase_1.WrapperProviderBase {
    constructor(provider, logTraffic = false) {
        super(provider);
        this.methodsCount = new Map();
        this.requestsCount = 0;
        this.logTraffic = logTraffic;
    }
    disconnect() {
        return false;
    }
    supportsSubscriptions() {
        return false;
    }
    send(payload, callback) {
        var _a, _b;
        this.requestsCount++;
        const currentCount = (_a = this.methodsCount.get(payload.method)) !== null && _a !== void 0 ? _a : 0;
        this.methodsCount.set(payload.method, currentCount + 1);
        let wrappedCallback = callback;
        if (this.logTraffic) {
            wrappedCallback = function (error, result) {
                var _a, _b;
                if (error != null) {
                    console.log(`<<< error: ${(_a = error.message) !== null && _a !== void 0 ? _a : 'null error message'}`);
                }
                console.log(`<<< result: ${(_b = JSON.stringify(result)) !== null && _b !== void 0 ? _b : 'null result'}`);
                callback(error, result);
            };
            console.log(`>>> payload: ${(_b = JSON.stringify(payload)) !== null && _b !== void 0 ? _b : 'null result'}`);
        }
        this.provider.send(payload, wrappedCallback);
    }
    reset() {
        this.requestsCount = 0;
        this.methodsCount.clear();
    }
    log() {
        console.log('Profiling Provider Stats:');
        new Map([...this.methodsCount.entries()].sort(function ([, count1], [, count2]) {
            return count2 - count1;
        })).forEach(function (value, key) {
            console.log(`Method: ${key.padEnd(30)} was called: ${value.toString().padEnd(3)} times`);
        });
        console.log(`Total RPC calls: ${this.requestsCount}`);
    }
}
exports.ProfilingProvider = ProfilingProvider;
//# sourceMappingURL=ProfilingProvider.js.map