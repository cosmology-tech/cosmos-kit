import { Chain } from '@chain-registry/types';
import { ChainRegistry } from '@cosmos-kit/core';

// TODO discuss Chain 
// maybe simplify so we can use `Chain` throughout the app
export function convert(chain: Chain): ChainRegistry {
    return {
      name: chain.chain_name,
      active: false,
      raw: chain,
      options: {
        stargate: (chainInfo) => undefined,
        cosmwasm: (chainInfo) => undefined,
      }
    };
  }