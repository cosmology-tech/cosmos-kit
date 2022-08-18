import { chainRegistryChainToKeplr } from '@chain-registry/keplr'
import { Chain } from '@chain-registry/types'
import { ChainRegistryInfo } from '@cosmos-kit/types'
import { ChainInfo } from '@keplr-wallet/types'

import { preferredChainInfo } from './preferred'

export const getKeplrChainInfo = async (
  chainName: string,
  info: ChainRegistryInfo
): Promise<ChainInfo> => {
  const chain: Chain | undefined = info.chains.find(
    (c) => c.chain_name === chainName
  )

  if (!chain) {
    throw new Error('cannot find chain: ' + chainName)
  }

  // you can add options as well to choose endpoints
  const config: ChainInfo = chainRegistryChainToKeplr(chain, info.assets, {
    getRestEndpoint: (chain) =>
      preferredChainInfo[chainName].rest ?? chain.apis?.rest[0]?.address,
    getRpcEndpoint: (chain) =>
      preferredChainInfo[chainName].rpc ?? chain.apis?.rpc[0]?.address,
  })

  return config
}
