import { ChainWalletData, WalletData } from '../../core/types'

export interface ChainKeplrData extends ChainWalletData {
  username: string
}

export type KeplrData = WalletData
