import { FalconWallet } from '@cosmos-kit/falcon'
import { KeplrWallet, KeplrWalletConnectWallet } from '@cosmos-kit/keplr'
import { Wallet } from '@cosmos-kit/types'

export const Wallets: Wallet[] = [
  KeplrWallet,
  KeplrWalletConnectWallet,
  FalconWallet,
]
