import { Chain } from '@chain-registry/types'
import { chains as rawChains } from 'chain-registry'

import { ChainRegistry, WalletRegistry } from '../core/types'
import { KeplrWallet } from '../wallets'

function convert(chain: Chain): ChainRegistry {
  return {
    name: chain.chain_name,
    active: true,
    raw: chain,
  }
}

export const chains: ChainRegistry[] = rawChains
  .filter((chain) => chain.network_type !== 'testnet')
  .map((chain) => convert(chain))

export const wallets: WalletRegistry[] = [
  {
    name: 'keplr-extension',
    active: true,
    wallet: new KeplrWallet(),
    prettyName: 'Keplr Extension',
    describe: 'Keplr browser extension connect',
    logo: 'https://dummyimage.com/200x200/1624b5/fff.jpg&text=web',
  },
  {
    name: 'keplr-extension-2',
    active: true,
    wallet: new KeplrWallet(),
    prettyName: 'Keplr Extension 2',
    describe: 'Keplr browser extension connect',
    logo: 'https://dummyimage.com/200x200/1624b5/fff.jpg&text=web',
  },
  // {
  //     name: "keplr mobile",
  //     Wallet: null,
  //     prettyName: "Keplr Mobile",
  //     logo: "https://dummyimage.com/200x200/1624b5/fff.jpg&text=mobile",
  //     describe: "Keplr mobile QRcode connect",
  // }
]
