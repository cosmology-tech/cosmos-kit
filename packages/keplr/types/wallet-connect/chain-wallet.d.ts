import { Callbacks, ChainRecord, ChainWalletBase, SessionOptions } from '@cosmos-kit/core';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';
import { KeplrMobileWallet } from './main-wallet';
import { ChainKeplrMobileData } from './types';
export declare class ChainKeplrMobile extends ChainWalletBase<KeplrWalletConnectV1, ChainKeplrMobileData, KeplrMobileWallet> {
    protected _client: KeplrWalletConnectV1;
    constructor(_chainRecord: ChainRecord, keplrWallet: KeplrMobileWallet);
    get client(): KeplrWalletConnectV1;
    get connector(): WalletConnect;
    get isInSession(): boolean;
    get username(): string | undefined;
    get qrUri(): string;
    private get emitter();
    connect(sessionOptions?: SessionOptions, callbacks?: Callbacks): Promise<void>;
    update(): Promise<void>;
    disconnect(callbacks?: Callbacks): Promise<void>;
}
