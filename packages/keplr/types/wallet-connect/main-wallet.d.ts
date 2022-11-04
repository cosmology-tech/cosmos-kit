/// <reference types="node" />
import { Callbacks, EndpointOptions, SessionOptions, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';
import { KeplrClient } from '../client';
export declare class KeplrMobileWallet extends MainWalletBase {
    client?: KeplrClient;
    connector: WalletConnect;
    emitter: EventEmitter;
    constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions);
    protected setChainsCallback(): void;
    get qrUri(): string;
    get appUrl(): string;
    connect(sessionOptions?: SessionOptions, callbacks?: Callbacks): Promise<void>;
    fetchClient(): Promise<KeplrClient>;
    disconnect(callbacks?: Callbacks): Promise<void>;
}
