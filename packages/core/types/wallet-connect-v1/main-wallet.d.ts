/// <reference types="node" />
import EventEmitter from 'events';
import { IWalletConnectClient, MainWalletBase } from '..';
import { Callbacks, IChainWalletConnect, SessionOptions, Wallet, WalletConnectClient } from '..';
export declare class WalletConnectWallet extends MainWalletBase {
    client: WalletConnectClient;
    emitter: EventEmitter;
    constructor(walletInfo: Wallet, _ChainWalletConnect: IChainWalletConnect, _WalletConnectClient: IWalletConnectClient);
    get connector(): IConnector;
    get qrUrl(): any;
    get appUrl(): string;
    fetchClient(): WalletConnectClient;
    protected onSetChainsDone(): void;
    connect: (sessionOptions?: SessionOptions, callbacks?: Callbacks) => Promise<void>;
    disconnect: (callbacks?: Callbacks) => Promise<void>;
}
