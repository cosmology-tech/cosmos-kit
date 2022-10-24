import { AssetList, Chain } from '@chain-registry/types';

import { ChainRecord, Endpoints, SignerOptions } from '../types/common';

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
    signerOptions: {
      stargate: signerOptions?.stargate?.(chain),
      cosmwasm: signerOptions?.cosmwasm?.(chain),
    },
    preferredEndpoints,
  };
}
