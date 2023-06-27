import { ChainWalletBase, Wallet, ChainRecord } from '@cosmos-kit/core';

declare class ChainVectisExtension extends ChainWalletBase {
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
}

export { ChainVectisExtension };
