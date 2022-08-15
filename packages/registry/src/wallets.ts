import { KeplrWallet, KeplrWalletConnectWallet } from '@cosmos-wallet/keplr'
import { Wallet } from '@cosmos-wallet/types'

export const Wallets: Wallet[] = [KeplrWallet, KeplrWalletConnectWallet]
