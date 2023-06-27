import { ChainWalletBase, Wallet, ChainRecord } from '@cosmos-kit/core';

declare class ChainCompassExtension extends ChainWalletBase {
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
}

export { ChainCompassExtension };
