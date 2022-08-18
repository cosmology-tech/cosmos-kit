import { AssetList, Chain } from '@chain-registry/types'
import { ChainInfo, ChainRegistryInfo } from '@cosmos-kit/types'

export const getChainInfo = (
  chainName: string,
  info: ChainRegistryInfo
): ChainInfo => {
  const chain: Chain | undefined = info.chains.find(
    (c) => c.chain_name === chainName
  )
  const assets: AssetList | undefined = info.assets.find(
    (c) => c.chain_name === chainName
  )

  if (!chain) {
    throw new Error('cannot find chain: ' + chainName)
  }

  return { chain, assets }
}
