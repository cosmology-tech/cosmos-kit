/// <reference types="node" />
import { Callbacks, ChainRecord, ChainWalletBase, SessionOptions, Wallet } from '@cosmos-kit/core';
import { SignClientTypes } from '@walletconnect/types';
import EventEmitter from 'events';
import { WCClientV2 } from './client';
import { IWCClientV2 } from './types';
export declare class ChainWCV2 extends ChainWalletBase {
    client: WCClientV2;
    emitter: EventEmitter;
    protected _qrUrl: string;
    wcSignClientOptions?: SignClientTypes.Options | undefined;
    WCClient: IWCClientV2;
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
    get appUrl(): any;
    get qrUrl(): string;
    set qrUrl(value: string);
    fetchClient(): Promise<WCClientV2>;
    connect: (sessionOptions?: SessionOptions, callbacks?: Callbacks) => Promise<void>;
    disconnect: (callbacks?: Callbacks) => Promise<void>;
}
