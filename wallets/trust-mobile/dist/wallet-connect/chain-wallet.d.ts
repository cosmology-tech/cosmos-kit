import { Wallet, ChainRecord } from '@cosmos-kit/core';
import { ChainWC } from '@cosmos-kit/walletconnect';

declare class ChainTrustMobile extends ChainWC {
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
}

export { ChainTrustMobile };
