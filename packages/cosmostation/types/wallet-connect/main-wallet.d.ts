/// <reference types="node" />
import { Callbacks, EndpointOptions, SessionOptions, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';
import { CosmostationClient } from '../client';
export declare class CosmostationMobileWallet extends MainWalletBase {
    client?: CosmostationClient;
    connector: WalletConnect;
    emitter: EventEmitter;
    constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions);
    protected setChainsCallback(): void;
    get isInSession(): boolean;
    get qrUri(): string;
    get appUrl(): string;
    connect(sessionOptions?: SessionOptions, callbacks?: Callbacks): Promise<void>;
    fetchClient(): Promise<CosmostationClient>;
    disconnect(callbacks?: Callbacks): Promise<void>;
}
