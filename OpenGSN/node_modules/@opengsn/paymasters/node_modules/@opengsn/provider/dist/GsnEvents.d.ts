export declare class GsnEvent {
    readonly event: string;
    readonly step: number;
    total: number;
    constructor(event: string, step: number);
}
export declare class GsnInitEvent extends GsnEvent {
    constructor();
}
export declare class GsnRefreshRelaysEvent extends GsnEvent {
    constructor();
}
export declare class GsnDoneRefreshRelaysEvent extends GsnEvent {
    readonly relaysCount: number;
    constructor(relaysCount: number);
}
export declare class GsnNextRelayEvent extends GsnEvent {
    readonly relayUrl: string;
    constructor(relayUrl: string);
}
export declare class GsnSignRequestEvent extends GsnEvent {
    constructor();
}
export declare class GsnValidateRequestEvent extends GsnEvent {
    constructor();
}
export declare class GsnSendToRelayerEvent extends GsnEvent {
    readonly relayUrl: string;
    constructor(relayUrl: string);
}
export declare class GsnRelayerResponseEvent extends GsnEvent {
    readonly success: boolean;
    constructor(success: boolean);
}
