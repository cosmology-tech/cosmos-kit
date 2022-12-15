/// <reference types="node" />
import EventEmitter from 'events';
import { Callbacks, IChainWCV2, MainWalletBase, SessionOptions, Wallet } from '..';
import { WCClientV2 } from './client';
export declare class WCWalletV2 extends MainWalletBase {
    clientPromise?: Promise<WCClientV2 | undefined>;
    client?: WCClientV2;
    protected _qrUrl: string;
    emitter: EventEmitter;
    constructor(walletInfo: Wallet, ChainWCV2: IChainWCV2);
    get appUrl(): any;
    get qrUrl(): string;
    set qrUrl(value: string);
    fetchClient(): Promise<WCClientV2>;
    protected onSetChainsDone(): void;
    connect: (sessionOptions?: SessionOptions, callbacks?: Callbacks) => Promise<void>;
    disconnect: (callbacks?: Callbacks) => Promise<void>;
}
