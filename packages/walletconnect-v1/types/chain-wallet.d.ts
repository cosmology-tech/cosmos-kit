/// <reference types="node" />
import { Callbacks, ChainRecord, ChainWalletBase, SessionOptions, Wallet } from '@cosmos-kit/core';
import EventEmitter from 'events';
import { IWCClientV1 } from './types';
export declare class ChainWCV1 extends ChainWalletBase {
    client: IWCClientV1;
    emitter: EventEmitter;
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
    get connector(): import("@walletconnect/types").IConnector;
    get qrUrl(): string;
    get appUrl(): string;
    connect: (sessionOptions?: SessionOptions, callbacks?: Callbacks) => Promise<void>;
    disconnect: (callbacks?: Callbacks) => Promise<void>;
}
