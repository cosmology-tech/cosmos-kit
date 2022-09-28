import { ChainInfo, ChainWalletBase } from '@cosmos-kit/core';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';
import { ChainKeplrMobileData } from './types';
import { KeplrMobileWallet } from './main-wallet';
export declare class ChainKeplrMobile extends ChainWalletBase<KeplrWalletConnectV1, ChainKeplrMobileData, KeplrMobileWallet> {
    constructor(_chainRecord: ChainInfo, keplrWallet: KeplrMobileWallet);
    get client(): KeplrWalletConnectV1;
    get connector(): WalletConnect;
    get isInSession(): boolean;
    get username(): string | undefined;
    get qrUri(): string;
    private get emitter();
    connect(): Promise<void>;
    update(): Promise<void>;
    disconnect(): Promise<void>;
}
