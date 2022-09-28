import { Chain } from '@chain-registry/types';

import { ChainInfo, Endpoints, SignerOptions } from '../types';

export function convertChain(
  chain: Chain,
  signerOptions?: SignerOptions,
  preferredEndpoints?: Endpoints
): ChainInfo {
  return {
    name: chain.chain_name,
    chain,
    signerOptions: {
      stargate: signerOptions?.stargate?.(chain),
      cosmwasm: signerOptions?.cosmwasm?.(chain),
    },
    preferredEndpoints,
  };
}
