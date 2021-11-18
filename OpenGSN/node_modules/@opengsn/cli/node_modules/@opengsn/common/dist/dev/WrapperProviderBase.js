"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WrapperProviderBase {
    constructor(provider) {
        this.provider = provider;
    }
    get connected() {
        return this.provider.connected;
    }
    get host() {
        return this.provider.host;
    }
    disconnect() {
        return this.provider.disconnect();
    }
    supportsSubscriptions() {
        return this.provider.supportsSubscriptions();
    }
}
exports.WrapperProviderBase = WrapperProviderBase;
//# sourceMappingURL=WrapperProviderBase.js.map