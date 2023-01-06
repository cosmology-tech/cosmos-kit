/// <reference types="node" />
import { Callbacks, MainWalletBase, SessionOptions, Wallet } from '@cosmos-kit/core';
import EventEmitter from 'events';
import { IChainWC, IWCClient, IWCClientV1 } from './types';
export declare class WCWalletV1 extends MainWalletBase {
    client: IWCClientV1;
    emitter: EventEmitter;
    constructor(walletInfo: Wallet, ChainWC: IChainWC, WCClient: IWCClient);
    get connector(): import("@walletconnect/types").IConnector;
    get qrUrl(): string;
    get appUrl(): string;
    fetchClient(): IWCClientV1;
    protected onSetChainsDone(): void;
    connect: (sessionOptions?: SessionOptions, callbacks?: Callbacks) => Promise<void>;
    disconnect: (callbacks?: Callbacks) => Promise<void>;
}
