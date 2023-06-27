import { ChainWalletBase, Wallet, ChainRecord } from '@cosmos-kit/core';

declare class ChainLeapExtension extends ChainWalletBase {
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
}

export { ChainLeapExtension };
