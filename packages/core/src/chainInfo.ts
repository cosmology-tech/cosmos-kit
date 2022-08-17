import { chainRegistryChainToKeplr } from '@chain-registry/keplr'
import { AssetList, Chain } from '@chain-registry/types'
import { ChainInfo } from '@keplr-wallet/types'

import { preferredChainInfo } from '../src/preferred'

export const getKeplrChainInfo = async (
  chainName: string,
  chains: Chain[],
  assets: AssetList[]
): Promise<ChainInfo> => {
  const chain: Chain | undefined = chains.find(
    (c) => c.chain_name === chainName
  )

  if (!chain) {
    throw new Error('cannot find chain: ' + chainName)
  }

  // you can add options as well to choose endpoints
  const config: ChainInfo = chainRegistryChainToKeplr(chain, assets, {
    getRestEndpoint: (chain) =>
      preferredChainInfo[chainName].rest ?? chain.apis?.rest[0]?.address,
    getRpcEndpoint: (chain) =>
      preferredChainInfo[chainName].rpc ?? chain.apis?.rpc[0]?.address,
  })

  return config
}
