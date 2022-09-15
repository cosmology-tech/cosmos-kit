import { ExtendedWallet, ManagerActions, WalletData, WalletStatus } from './types';
import {
  ChainRepo,
  createChainRepo,
  createWalletRepo,
  WalletRepo,
} from './repositories';
import {
  Actions,
  Autos,
  ChainName,
  ChainRegistry,
  WalletName,
  WalletRegistry,
} from './types';
import { StateBase } from './bases';

export class WalletManager extends StateBase<WalletData> {
  protected _currentWalletName?: WalletName;
  protected _currentChainName?: ChainName;
  protected _useModal = true;
  protected _concurrency?: number;
  declare actions?: ManagerActions<WalletData>;
  walletRepo: WalletRepo;
  chainRepo: ChainRepo;
  autos?: Autos;

  constructor(
    chains?: ChainRegistry[],
    wallets?: WalletRegistry[],
    _concurrency?: number
  ) {
    super();
    this._concurrency = _concurrency;
    this.walletRepo = createWalletRepo(wallets, true, true);
    this.chainRepo = createChainRepo(chains, true, true);
    console.info(`${this.walletCount} wallets and ${this.chainCount} chains are used!`)
    this.walletRepo.registeredItemMap.forEach((item) => {
      item.wallet.setSupportedChains(this.chainRepo.activeItems);
    });
  }

  get emitWalletName() {
    return this.actions?.walletName;
  }

  get emitChainName() {
    return this.actions?.chainName;
  }

  get emitModalOpen() {
    return this.actions?.modalOpen;
  }

  setAction(actions: Actions) {
    this.actions = actions;
  }

  setAutos(autos: Autos) {
    this.autos = autos;
  }

  get currentWalletName() {
    return this._currentWalletName;
  }

  setCurrentWallet(walletName?: WalletName, autoConnect: boolean = true) {
    this.reset();
    this._currentWalletName = walletName;
    this.emitWalletName?.(walletName);
    if (autoConnect && this.autos?.connectWhenCurrentChanges) {
      this.connect();
    }
  }

  get currentChainName() {
    return this._currentChainName;
  }

  setCurrentChain(chainName?: ChainName, autoConnect: boolean = true) {
    this.reset();
    console.log(12, this.state)
    this._currentChainName = chainName;
    this.emitChainName?.(chainName);
    if (autoConnect && this.autos?.connectWhenCurrentChanges) {
      this.connect();
    }
  }

  get useModal() {
    return this._useModal;
  }

  emit(type: string) {
    return this.actions?.[type];
  }

  get username() {
    return this.data?.username as string;
  }

  get address() {
    return this.data?.address as string;
  }

  get activeWallets() {
    return this.walletRepo.activeItems;
  }

  get walletNames() {
    return this.activeWallets.map((item) => item.name);
  }

  get walletCount() {
    return this.walletNames.length;
  }

  useWallets(walletNameInfo: WalletName[] | WalletName) {
    this.walletRepo.inactivateAll();
    if (Array.isArray(walletNameInfo)) {
      if (walletNameInfo.length === 0) {
        throw new Error('No wallet provided!');
      }
      walletNameInfo.forEach((name) => {
        this.walletRepo.activate(name);
      });
      this._useModal = true;
    } else {
      this.walletRepo.activate(walletNameInfo);
      this.setCurrentWallet(walletNameInfo);
      this._useModal = false;
    }
    console.info(`${this.walletCount} wallets are used!`)
  }

  get activeChains() {
    return this.chainRepo.activeItems;
  }

  get chainNames() {
    return this.activeChains.map((item) => item.name);
  }

  get chainCount() {
    return this.chainNames.length;
  }

  useChains(chainNames: ChainName[]) {
    this.chainRepo.inactivateAll();
    chainNames.forEach((name) => {
      this.chainRepo.activate(name);
    });
    this.walletRepo.registeredItemMap.forEach((item) => {
      item.wallet.setSupportedChains(this.chainRepo.activeItems);
    });
    console.info(`${this.chainCount} chains are used!`)
  }

  getWallet(walletName?: WalletName, chainName?: ChainName): ExtendedWallet | undefined {
    if (!walletName) {
      return undefined;
    }

    let wallet = this.walletRepo.getItem(walletName).wallet;
    if (chainName) {
      wallet = wallet.getChain(chainName);
    }
    wallet.actions = this.actions;
    return wallet;
  }

  get currentWallet(): ExtendedWallet | undefined {
    return this.getWallet(this.currentWalletName, this.currentChainName);
  }

  update(emit: boolean = true) {
    this.setData(this.currentWallet.data, emit);
    this.setMessage(this.currentWallet.message, emit);
    this.setState(this.currentWallet.state, emit);
  }

  get connect() {
    return async () => {
      if (!this.currentWalletName) {
        this.openModal();
        return
      }
      try {
        await this.currentWallet.connect();
        this.update(false);

        if (
          this.walletStatus === WalletStatus.Connected
          && this.autos?.closeModalWhenWalletIsConnected
        ) {
          this.emitModalOpen?.(false);
        }
      } catch (error) {
        console.error(error);
        if (
          this.walletStatus === WalletStatus.Rejected
          && this.autos?.closeModalWhenWalletIsRejected
        ) {
          this.emitModalOpen?.(false);
        }
      }
    };
  }

  get disconnect() {
    return async () => {
      if (!this.currentWalletName) {
        this.setMessage('Current Wallet not defined.')
        return
      }

      try {
        await this.currentWallet.disconnect();
        this.update(false);

        if (
          this.walletStatus === WalletStatus.Disconnected
          && this.autos?.closeModalWhenWalletIsDisconnected
        ) {
          this.emitModalOpen?.(false);
        }
      } catch (e) {
        this.setMessage((e as Error).message)
        if (
          this.walletStatus === WalletStatus.Rejected
          && this.autos?.closeModalWhenWalletIsRejected
        ) {
          this.emitModalOpen?.(false);
        }
      }

      if (this.useModal) {
        this.setCurrentWallet(undefined, false);
      }
    };
  }

  get openModal() {
    return () => {
      this.emitModalOpen?.(true);
    }
  }

  get concurrency() {
    return this._concurrency;
  }
}
