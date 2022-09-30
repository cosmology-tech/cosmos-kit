import { AssetList, Chain } from '@chain-registry/types';

import { ChainInfo, Endpoints, SignerOptions } from '../types';

export function convertChain(
  chain: Chain,
  assetLists: AssetList[],
  signerOptions?: SignerOptions,
  preferredEndpoints?: Endpoints
): ChainInfo {
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
