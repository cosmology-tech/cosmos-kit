import { ChainName, ChainContext } from '@cosmos-kit/core';

declare const useChain: (chainName: ChainName, sync?: boolean) => ChainContext;

export { useChain };
