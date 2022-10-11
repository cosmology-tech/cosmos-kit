/// <reference types="node" />
import { Callbacks, ChainRecord, SessionOptions, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';
import { ChainKeplrMobile } from './chain-wallet';
import { KeplrMobileData } from './types';
export declare class KeplrMobileWallet extends MainWalletBase<KeplrWalletConnectV1, KeplrMobileData, ChainKeplrMobile> {
    private _client;
    connector: WalletConnect;
    emitter: EventEmitter;
    constructor(_walletInfo?: Wallet, _chainsInfo?: ChainRecord[]);
    get client(): KeplrWalletConnectV1;
    get isInSession(): boolean;
    get qrUri(): string;
    setClient(client: KeplrWalletConnectV1): void;
    setChains(supportedChains: ChainRecord[]): void;
    connect(sessionOptions?: SessionOptions, callbacks?: Callbacks): Promise<void>;
    update(): Promise<void>;
    disconnect(callbacks?: Callbacks): Promise<void>;
}
