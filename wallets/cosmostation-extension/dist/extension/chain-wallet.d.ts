import { ChainWalletBase, Wallet, ChainRecord } from '@cosmos-kit/core';

declare class ChainCosmostationExtension extends ChainWalletBase {
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
}

export { ChainCosmostationExtension };
