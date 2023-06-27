import { ChainWalletBase, Wallet, ChainRecord } from '@cosmos-kit/core';

declare class Web3AuthChainWallet extends ChainWalletBase {
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
}

export { Web3AuthChainWallet };
