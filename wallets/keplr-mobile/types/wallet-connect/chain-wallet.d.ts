import { ChainRecord, Wallet } from '@cosmos-kit/core';
import { ChainWC } from '@cosmos-kit/walletconnect';
export declare class ChainKeplrMobile extends ChainWC {
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
}
