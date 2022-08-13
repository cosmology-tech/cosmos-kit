import { KeplrWallet, KeplrWalletConnectWallet } from '@cosmos-wallet/keplr'
import { Wallet } from '@cosmos-wallet/types'

export const AllWallets: Wallet[] = [KeplrWallet, KeplrWalletConnectWallet]
