import { ChainWalletBase, Wallet, ChainRecord } from '@cosmos-kit/core';

declare class ChainXDEFIExtension extends ChainWalletBase {
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
}

export { ChainXDEFIExtension };
