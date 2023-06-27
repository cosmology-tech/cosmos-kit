import { Wallet, EndpointOptions } from '@cosmos-kit/core';
import { WCWallet } from '@cosmos-kit/walletconnect';

declare class CosmostationMobileWallet extends WCWallet {
    constructor(walletInfo: Wallet, preferredEndpoints?: EndpointOptions['endpoints']);
}

export { CosmostationMobileWallet };
