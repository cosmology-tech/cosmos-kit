import { Wallet, ChainRecord } from '@cosmos-kit/core';
import { ChainWC } from '@cosmos-kit/walletconnect';

declare class ChainCosmostationMobile extends ChainWC {
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
}

export { ChainCosmostationMobile };
