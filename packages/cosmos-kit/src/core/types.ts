import { Chain } from '@chain-registry/types'

import { MainWalletBase } from './bases'

export interface ChainWalletData {
  address: string
}

export interface WalletData {
  username: string
}

export enum State {
  Init = 'Init',
  Pending = 'Pending',
  Done = 'Done',
  Error = 'Error',
}

export interface Mutable<T> {
  state: State
  data?: T
}

export type ChainName = string
export type WalletName = string

export type Dispatch<T> = (value: T) => void

export interface Registry<Name> {
  name: Name
  active: boolean
}

export interface WalletRegistry extends Registry<WalletName> {
  wallet: MainWalletBase<any, any>
  prettyName: string
  logo?: string
  describe?: string
}

export interface ChainRegistry extends Registry<ChainName> {
  raw?: Chain
}

export interface WalletModalProps {
  open: boolean
  setOpen: Dispatch<boolean>
  walletOptions: {
    id: string
    logo?: string
    title?: string
    describe?: string
    onClick: () => void
  }[]
}
