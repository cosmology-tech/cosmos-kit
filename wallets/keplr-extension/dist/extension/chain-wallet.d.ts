import { ChainWalletBase, Wallet, ChainRecord } from '@cosmos-kit/core';

declare class ChainKeplrExtension extends ChainWalletBase {
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
}

export { ChainKeplrExtension };
