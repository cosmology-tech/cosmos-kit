import { ChainName, WalletName, ChainWalletContext } from '@cosmos-kit/core';

declare const useChainWallet: (chainName: ChainName, walletName: WalletName, sync?: boolean) => ChainWalletContext;

export { useChainWallet };
