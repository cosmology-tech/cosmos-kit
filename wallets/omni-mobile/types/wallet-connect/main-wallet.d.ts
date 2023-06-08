import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { WCWallet } from '@cosmos-kit/walletconnect';
export declare class OmniMobileWallet extends WCWallet {
    constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions['endpoints']);
}
