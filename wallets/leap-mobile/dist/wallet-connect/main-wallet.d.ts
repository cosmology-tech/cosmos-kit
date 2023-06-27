import { Wallet, EndpointOptions } from '@cosmos-kit/core';
import { WCWallet } from '@cosmos-kit/walletconnect';

declare class LeapMobileWallet extends WCWallet {
    constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions['endpoints']);
}

export { LeapMobileWallet };
