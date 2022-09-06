import { ChainWalletBase, MainWalletBase } from './bases'
import { chains, wallets } from './config'
import {
  ChainRepo,
  createChainRepo,
  createWalletRepo,
  WalletRepo,
} from './repositories'
import { ChainName, Dispatch, State, WalletName } from './types'

export class WalletManager {
  protected _currentWalletName?: WalletName
  protected _currentChainName?: ChainName
  protected _useModal = true
  actions?: {
    walletState?: Dispatch<State>
    walletData?: Dispatch<unknown | undefined>
    chainWalletState?: Dispatch<State>
    chainWalletData?: Dispatch<unknown | undefined>
    walletName?: Dispatch<WalletName | undefined>
    // chainName?: Dispatch<ChainName>,
    openModal?: Dispatch<boolean>
  }
  walletRepo: WalletRepo
  chainRepo: ChainRepo
  autoConnect = true

  constructor(protected _concurrency?: number) {
    this.walletRepo = createWalletRepo(wallets, true)
    this.chainRepo = createChainRepo(chains, true)
    this.walletRepo.registeredItemMap.forEach((item) => {
      item.wallet.setSupportedChains(this.chainRepo.activeNames)
    })
  }

  get currentWalletName() {
    return this._currentWalletName
  }

  setCurrentWallet(walletName?: WalletName) {
    this.emitWalletDisconnect()
    this._currentWalletName = walletName
    this.emitWalletName?.(walletName)
  }

  get currentChainName() {
    return this._currentChainName
  }

  setCurrentChain(chainName?: ChainName) {
    this.emitChainWalletDisconnect()
    this._currentChainName = chainName
    if (this.currentWalletName && this.autoConnect) {
      this.connect()
    }
  }

  get useModal() {
    return this._useModal
  }

  get emitWalletName() {
    return this.actions?.walletName
  }

  get emitWalletState() {
    return this.actions?.walletState
  }

  get emitWalletData() {
    return this.actions?.walletData
  }

  get emitChainWalletState() {
    return this.actions?.chainWalletState
  }

  get emitChainWalletData() {
    return this.actions?.chainWalletData
  }

  get emitOpenModal() {
    return this.actions?.openModal
  }

  emitWalletDisconnect() {
    this.emitWalletData?.(undefined)
    this.emitWalletState?.(State.Init)
  }

  emitChainWalletDisconnect() {
    this.emitChainWalletData?.(undefined)
    this.emitChainWalletState?.(State.Init)
  }

  get username() {
    return this.currentWallet?.username
  }

  get address() {
    return this.currentChainWallet?.address
  }

  get walletInfos() {
    return this.walletRepo.activeItems
  }

  get walletNames() {
    return this.walletRepo.activeItems.map((item) => item.name)
  }

  get walletCount() {
    return this.walletNames.length
  }

  get state() {
    return this.currentChainName
      ? this.currentChainWallet?.state
      : this.currentWallet?.state
  }

  get isConnected() {
    return this.state === State.Done
  }

  useWallets(walletNameInfo: WalletName[] | WalletName) {
    this.walletRepo.inactivateAll()
    if (Array.isArray(walletNameInfo)) {
      walletNameInfo.forEach((name) => {
        this.walletRepo.activate(name)
      })
      this._useModal = true
    } else {
      this.walletRepo.activate(walletNameInfo)
      this.setCurrentWallet(walletNameInfo)
      this._useModal = false
    }
  }

  get chainInfos() {
    return this.chainRepo.activeItems
  }

  get chainNames() {
    return this.chainRepo.activeItems.map((item) => item.name)
  }

  get chainCount() {
    return this.chainNames.length
  }

  useChains(chainNames: ChainName[]) {
    this.chainRepo.inactivateAll()
    chainNames.forEach((name) => {
      this.chainRepo.activate(name)
    })
    this.walletRepo.registeredItemMap.forEach((item) => {
      item.wallet.setSupportedChains(chainNames)
    })
  }

  getWallet(walletName: WalletName): MainWalletBase<any, any> {
    return this.walletRepo.getItem(walletName).wallet
  }

  get currentWallet() {
    return this.currentWalletName
      ? this.getWallet(this.currentWalletName)
      : undefined
  }

  get currentChainWallet(): ChainWalletBase<any, any> | undefined {
    return this.currentChainName
      ? this.currentWallet?.getChain(this.currentChainName)
      : undefined
  }

  getChainConnect(walletName: WalletName, chainName: ChainName, emit = true) {
    return async () => {
      const chainWallet = this.getWallet(walletName).getChain(chainName)
      if (emit) {
        await chainWallet.connect(
          this.emitChainWalletState,
          this.emitChainWalletData
        )
      } else {
        await chainWallet.connect()
      }
    }
  }

  getConnect(walletName: WalletName) {
    return async () => {
      const wallet = this.getWallet(walletName)
      await wallet.connect(this.emitWalletState, this.emitWalletData)
    }
  }

  get connect() {
    return async () => {
      if (!this.currentWalletName) {
        throw new Error('Wallet not selected!')
      }
      try {
        await this.getConnect(this.currentWalletName)()
        if (this.currentChainName) {
          await this.getChainConnect(
            this.currentWalletName,
            this.currentChainName
          )()
        }
      } catch (error) {
        console.error(error)
      }

      if (this.emitOpenModal) {
        this.emitOpenModal(false)
      }
    }
  }

  getChainDisconnect(
    walletName: WalletName,
    chainName: ChainName,
    emit = true
  ) {
    return async () => {
      const chainWallet = this.getWallet(walletName).getChain(chainName)
      if (emit) {
        await chainWallet.disconnect(
          this.emitChainWalletState,
          this.emitChainWalletData
        )
      } else {
        await chainWallet.disconnect()
      }
    }
  }

  getDisconnect(walletName: WalletName) {
    return async () => {
      const wallet = this.getWallet(walletName)
      wallet.disconnect(this.emitWalletState, this.emitWalletData)
    }
  }

  get disconnect() {
    return async () => {
      if (!this.currentWalletName) {
        throw new Error('Wallet not selected!')
      }

      try {
        if (this.currentChainName) {
          await this.getChainDisconnect(
            this.currentWalletName,
            this.currentChainName
          )()
        }
        await this.getDisconnect(this.currentWalletName)()
      } catch (error) {
        console.error(error)
      }

      if (this.useModal) {
        this.setCurrentWallet(undefined)
      }

      // if (this.actions?.walletName) {
      //   this.actions.walletName(undefined);
      // }
    }
  }

  get concurrency() {
    return this._concurrency
  }
}

export function createWalletManager(concurrency?: number) {
  const walletManager = new WalletManager(concurrency)
  return walletManager
}
