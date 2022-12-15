/// <reference types="node" />
import EventEmitter from 'events';
import { Callbacks, ChainRecord, ChainWalletBase, SessionOptions, Wallet, WalletConnectClient } from '..';
export declare class ChainWalletConnect extends ChainWalletBase {
    client: WalletConnectClient;
    emitter: EventEmitter;
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
    get connector(): IConnector;
    get qrUrl(): any;
    get appUrl(): string;
    connect: (sessionOptions?: SessionOptions, callbacks?: Callbacks) => Promise<void>;
    disconnect: (callbacks?: Callbacks) => Promise<void>;
}
