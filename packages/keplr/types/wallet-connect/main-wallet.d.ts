/// <reference types="node" />
import { Callbacks, ChainRecord, SessionOptions, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';
import { ChainKeplrMobile } from './chain-wallet';
import { KeplrMobileData } from './types';
export declare class KeplrMobileWallet extends MainWalletBase<KeplrWalletConnectV1, KeplrMobileData, ChainKeplrMobile> {
    connector: WalletConnect;
    emitter: EventEmitter;
    constructor(walletInfo?: Wallet, chains?: ChainRecord[]);
    get isInSession(): boolean;
    get qrUri(): string;
    setChains(chains: ChainRecord[]): void;
    connect(sessionOptions?: SessionOptions, callbacks?: Callbacks): Promise<void>;
    fetchClient(): Promise<KeplrWalletConnectV1>;
    update(callbacks?: Callbacks): Promise<void>;
    disconnect(callbacks?: Callbacks): Promise<void>;
}
