import { AssetList, Chain } from '@chain-registry/types';

import { ChainRecord, Endpoints, SignerOptions } from '../types';
import { getIsLazy } from './endpoint';
import { Logger } from './logger';

export function convertChain(
  chain: Chain,
  assetLists: AssetList[],
  signerOptions?: SignerOptions,
  preferredEndpoints?: Endpoints,
  isLazy?: boolean,
  logger?: Logger
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
      preferredSignType: signerOptions?.preferredSignType?.(chain) || 'amino',
    },
    preferredEndpoints: {
      ...preferredEndpoints,
      isLazy: getIsLazy(
        isLazy,
        preferredEndpoints?.isLazy,
        void 0,
        void 0,
        logger
      ),
    },
  };
}
