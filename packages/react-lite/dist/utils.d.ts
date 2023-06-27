import { ChainWalletBase, ChainWalletContext } from '@cosmos-kit/core';

declare function getChainWalletContext(chainId: string, wallet?: ChainWalletBase, sync?: boolean): ChainWalletContext;

export { getChainWalletContext };
