import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { WCWalletV1 } from '@cosmos-kit/walletconnect-v1';
export declare class KeplrMobileWallet extends WCWalletV1 {
    constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions);
}
