import { Wallet, EndpointOptions } from '@cosmos-kit/core';
import { WCWallet } from '@cosmos-kit/walletconnect';

declare class OmniMobileWallet extends WCWallet {
    constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions['endpoints']);
}

export { OmniMobileWallet };
