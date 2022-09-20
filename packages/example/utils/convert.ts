import { Chain } from '@chain-registry/types';
import { ChainInfo } from '@cosmos-kit/core';

// TODO discuss Chain 
// maybe simplify so we can use `Chain` throughout the app
export function convert(chain: Chain): ChainInfo {
    return {
      name: chain.chain_name,
      active: false,
      registry: chain,
      options: {
        stargate: (chainInfo) => undefined,
        cosmwasm: (chainInfo) => undefined,
      }
    };
  }