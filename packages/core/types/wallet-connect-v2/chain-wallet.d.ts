/// <reference types="node" />
import EventEmitter from 'events';
import { Callbacks, ChainRecord, ChainWalletBase, SessionOptions, Wallet } from '..';
import { WCClientV2 } from './client';
export declare class ChainWCV2 extends ChainWalletBase {
    client: WCClientV2;
    emitter: EventEmitter;
    protected _qrUrl: string;
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
    get appUrl(): any;
    get qrUrl(): string;
    set qrUrl(value: string);
    connect: (sessionOptions?: SessionOptions, callbacks?: Callbacks) => Promise<void>;
    disconnect: (callbacks?: Callbacks) => Promise<void>;
}
