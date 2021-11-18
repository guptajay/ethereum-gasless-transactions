"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * base export class for all events fired by RelayClient.
 * for "progress" report, it is enough to test the base export class only.
 * subclasses contain some extra information about the events.
 * Last event is when we receive response from relayer that event was sent - now we should wait for mining..
 */
const TOTAL_EVENTS = 7;
class GsnEvent {
    constructor(event, step) {
        this.event = event;
        this.step = step;
        this.total = TOTAL_EVENTS;
    }
}
exports.GsnEvent = GsnEvent;
// initialize client (should be done before all requests. not counted in "total")
class GsnInitEvent extends GsnEvent {
    constructor() { super('init', 0); }
}
exports.GsnInitEvent = GsnInitEvent;
class GsnRefreshRelaysEvent extends GsnEvent {
    constructor() { super('refresh-relays', 1); }
}
exports.GsnRefreshRelaysEvent = GsnRefreshRelaysEvent;
class GsnDoneRefreshRelaysEvent extends GsnEvent {
    constructor(relaysCount) {
        super('refreshed-relays', 2);
        this.relaysCount = relaysCount;
    }
}
exports.GsnDoneRefreshRelaysEvent = GsnDoneRefreshRelaysEvent;
class GsnNextRelayEvent extends GsnEvent {
    constructor(relayUrl) {
        super('next-relay', 3);
        this.relayUrl = relayUrl;
    }
}
exports.GsnNextRelayEvent = GsnNextRelayEvent;
class GsnSignRequestEvent extends GsnEvent {
    constructor() { super('sign-request', 4); }
}
exports.GsnSignRequestEvent = GsnSignRequestEvent;
// before sending the request to the relayer, the client attempt to verify it will succeed.
// validation may fail if the paymaster rejects the request
class GsnValidateRequestEvent extends GsnEvent {
    constructor() { super('validate-request', 5); }
}
exports.GsnValidateRequestEvent = GsnValidateRequestEvent;
class GsnSendToRelayerEvent extends GsnEvent {
    constructor(relayUrl) {
        super('send-to-relayer', 6);
        this.relayUrl = relayUrl;
    }
}
exports.GsnSendToRelayerEvent = GsnSendToRelayerEvent;
class GsnRelayerResponseEvent extends GsnEvent {
    constructor(success) {
        super('relayer-response', 7);
        this.success = success;
    }
}
exports.GsnRelayerResponseEvent = GsnRelayerResponseEvent;
//# sourceMappingURL=GsnEvents.js.map