import { ChainWalletBase, Wallet, ChainRecord } from '@cosmos-kit/core';

declare class ChainExodusExtension extends ChainWalletBase {
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
}

export { ChainExodusExtension };
