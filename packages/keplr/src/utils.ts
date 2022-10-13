import { chainRegistryChainToKeplr } from '@chain-registry/keplr';
import { ChainRecord } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';

import { preferredEndpoints } from './config';

export async function suggestChain<T extends Keplr>(
  keplr: T,
  chainInfo: ChainRecord
) {
  const suggestChain = chainRegistryChainToKeplr(chainInfo.chain, [
    chainInfo.assetList,
  ]);

  if (preferredEndpoints[chainInfo.name]) {
    (suggestChain.rest as string) = preferredEndpoints[chainInfo.name].rest[0];
  }
  if (preferredEndpoints[chainInfo.name]) {
    (suggestChain.rpc as string) = preferredEndpoints[chainInfo.name].rpc[0];
  }

  await keplr.experimentalSuggestChain(suggestChain);
  return keplr;
}
