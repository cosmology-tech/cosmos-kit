import { AssetList, Chain } from '@chain-registry/types';

import { ChainRecord, Endpoints, SignerOptions } from '../types';

export function convertChain(
  chain: Chain,
  assetLists: AssetList[],
  signerOptions?: SignerOptions,
  preferredEndpoints?: Endpoints
): ChainRecord {
  const assetList = assetLists.find(
    (list) => list.chain_name === chain.chain_name
  );
  return {
    name: chain.chain_name,
    chain,
    assetList,
    clientOptions: {
      stargate: signerOptions?.stargate?.(chain),
      signingStargate: signerOptions?.signingStargate?.(chain),
      signingCosmwasm: signerOptions?.signingCosmwasm?.(chain),
    },
    preferredEndpoints,
  };
}
