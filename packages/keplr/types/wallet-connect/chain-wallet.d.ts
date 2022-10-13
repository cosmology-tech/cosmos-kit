/// <reference types="node" />
import { Callbacks, ChainRecord, ChainWalletBase, SessionOptions, Wallet } from '@cosmos-kit/core';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';
import { ChainKeplrMobileData } from './types';
export declare class ChainKeplrMobile extends ChainWalletBase<KeplrWalletConnectV1, ChainKeplrMobileData> {
    private _emitter;
    constructor(walletInfo: Wallet, chainInfo: ChainRecord, client: KeplrWalletConnectV1, emitter: EventEmitter);
    get connector(): WalletConnect;
    get isInSession(): boolean;
    get username(): string | undefined;
    get qrUri(): string;
    connect(sessionOptions?: SessionOptions, callbacks?: Callbacks): Promise<void>;
    fetchClient(): Promise<KeplrWalletConnectV1>;
    update(): Promise<void>;
    disconnect(callbacks?: Callbacks): Promise<void>;
}
