import { ChainWalletBase, Wallet, ChainRecord } from '@cosmos-kit/core';

declare class ChainTrustExtension extends ChainWalletBase {
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
}

export { ChainTrustExtension };
