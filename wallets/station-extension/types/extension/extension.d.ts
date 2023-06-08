import { Tx, ExtensionOptions } from '@terra-money/feather.js';
import { NetworkInfo, Addresses, Pubkeys, ChainId } from './types';
declare type ConnectResponse = {
    address: string;
    addresses: Addresses;
    pubkey: Pubkeys;
};
declare type InfoResponse = Record<ChainId, NetworkInfo>;
declare type SignResponse = {
    payload: {
        result: Tx.Data;
    };
};
export declare class StationExtension {
    private extension;
    identifier: string;
    _inTransactionProgress: boolean;
    connectResolvers: Set<[(data: any) => void, (error: any) => void]>;
    infoResolvers: Set<[(data: any) => void, (error: any) => void]>;
    pubkeyResolvers: Set<[(data: any) => void, (error: any) => void]>;
    signResolvers: Map<number, [(data: any) => void, (error: any) => void]>;
    constructor();
    get isAvailable(): boolean;
    init(): Promise<void>;
    connect(): Promise<ConnectResponse>;
    info(): Promise<InfoResponse>;
    getPubKey(): Promise<ConnectResponse>;
    disconnect(): void;
    sign({ purgeQueue, ...data }: ExtensionOptions): Promise<SignResponse>;
    private onResponse;
}
export {};
