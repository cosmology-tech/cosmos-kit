/// <reference types="node" />
import { ChainInfo, ChainName, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';
import { ChainKeplrMobile } from './chain-wallet';
import { ChainKeplrMobileData, KeplrMobileData } from './types';
export declare class KeplrMobileWallet extends MainWalletBase<KeplrWalletConnectV1, KeplrMobileData, ChainKeplrMobileData, ChainKeplrMobile> {
    protected _chains: Map<ChainName, ChainKeplrMobile>;
    protected _client: KeplrWalletConnectV1;
    connector: WalletConnect;
    emitter: EventEmitter;
    constructor(_walletInfo?: Wallet, _chainsInfo?: ChainInfo[]);
    get isInSession(): boolean;
    get qrUri(): string;
    get client(): KeplrWalletConnectV1;
    setClient(client: KeplrWalletConnectV1): void;
    setChains(supportedChains: ChainInfo[]): void;
    connect(): Promise<void>;
    update(): Promise<void>;
    disconnect(): Promise<void>;
}
