import { EndpointOptions, Wallet, WalletConnectWallet } from '@cosmos-kit/core';
export declare class KeplrMobileWallet extends WalletConnectWallet {
    constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions);
}
