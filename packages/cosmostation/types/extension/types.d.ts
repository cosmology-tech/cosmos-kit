export interface CosmostationSignOptions {
    readonly preferNoSetFee?: boolean;
    readonly preferNoSetMemo?: boolean;
    readonly disableBalanceCheck?: boolean;
}
export interface Request {
    method: string;
    params: object;
}
export interface Cosmostation {
    request(request: Request): Promise<any>;
    on(type: string, listener: EventListenerOrEventListenerObject): Event;
    off(event: Event): void;
}
export declare type RequestAccountResponse = {
    name: string;
    address: string;
    publicKey: Uint8Array;
    isLedger: boolean;
};
