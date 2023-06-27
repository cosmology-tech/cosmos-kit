import { Wallet, ChainRecord } from '@cosmos-kit/core';
import { ChainWC } from '@cosmos-kit/walletconnect';

declare class ChainOmniMobile extends ChainWC {
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
}

export { ChainOmniMobile };
