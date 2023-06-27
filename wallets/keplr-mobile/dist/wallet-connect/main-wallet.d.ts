import { Wallet, EndpointOptions } from '@cosmos-kit/core';
import { WCWallet } from '@cosmos-kit/walletconnect';

declare class KeplrMobileWallet extends WCWallet {
    constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions['endpoints']);
}

export { KeplrMobileWallet };
