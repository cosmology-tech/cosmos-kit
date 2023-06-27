import { ChainWalletBase, Wallet, ChainRecord } from '@cosmos-kit/core';

declare class ChainFrontierExtension extends ChainWalletBase {
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
}

export { ChainFrontierExtension };
