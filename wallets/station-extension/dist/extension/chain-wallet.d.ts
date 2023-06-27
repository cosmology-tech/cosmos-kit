import { ChainWalletBase, Wallet, ChainRecord } from '@cosmos-kit/core';

declare class ChainStationExtension extends ChainWalletBase {
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
}

export { ChainStationExtension };
