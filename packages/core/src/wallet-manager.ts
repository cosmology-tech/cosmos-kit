import { ExtendedWallet, WalletStatus } from './types';
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
  State,
  WalletName,
  WalletRegistry,
} from './types';
import { getWalletStatusFromState } from './utils';

export class WalletManager {
  protected _currentWalletName?: WalletName;
  protected _currentChainName?: ChainName;
  protected _useModal = true;
  actions?: Actions;
  walletRepo: WalletRepo;
  chainRepo: ChainRepo;
  autos?: Autos;

  protected _concurrency?: number;

  constructor(
    chains?: ChainRegistry[],
    wallets?: WalletRegistry[],
    _concurrency?: number
  ) {
    this._concurrency = _concurrency;
    this.walletRepo = createWalletRepo(wallets, true, true);
    this.chainRepo = createChainRepo(chains, true, true);
    console.info(`${this.walletCount} wallets and ${this.chainCount} chains are used!`)
    this.walletRepo.registeredItemMap.forEach((item) => {
      item.wallet.setSupportedChains(this.chainRepo.activeItems);
    });
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
    this.emitDisconnect();
    this._currentWalletName = walletName;
    this.emit('walletName')?.(walletName);
    if (autoConnect && this.autos?.connectWhenCurrentChanges) {
      this.connect();
    }
  }

  get currentChainName() {
    return this._currentChainName;
  }

  setCurrentChain(chainName?: ChainName, autoConnect: boolean = true) {
    this.emitDisconnect();
    this._currentChainName = chainName;
    this.emit('chainName')?.(chainName);
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

  emitDisconnect() {
    this.emit('data')?.(undefined);
    this.emit('message')?.(undefined);
    this.emit('state')?.(State.Init);
  }

  get data() {
    return this.currentWallet?.data;
  }

  get username() {
    return this.data?.username as string;
  }

  get address() {
    return this.data?.address as string;
  }

  get state() {
    return this.currentWallet?.state;
  }

  get message() {
    return this.currentWallet?.message;
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

  get walletStatus() {
    return getWalletStatusFromState(this.state, this.message);
  }

  get isConnected() {
    return this.state === State.Done;
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

  get currentWallet() {
    return this.getWallet(this.currentWalletName, this.currentChainName);
  }

  get connect() {
    return async () => {
      console.log(11111, this.currentWalletName)
      if (!this.currentWalletName) {
          this.openModal();
        return
      }
      try {
        await this.getWallet(this.currentWalletName, this.currentChainName).connect();

        if (
          this.walletStatus === WalletStatus.Connected
          && this.autos?.closeModalWhenWalletIsConnected
        ) {
          this.emit('modalOpen')?.(false);
        }
      } catch (error) {
        console.error(error);
        if (
          this.walletStatus === WalletStatus.Rejected
          && this.autos?.closeModalWhenWalletIsRejected
        ) {
          this.emit('modalOpen')?.(false);
        }
      }
    };
  }

  get disconnect() {
    return async () => {
      if (!this.currentWalletName) {
        this.emit('message')?.('Current Wallet not defined.')
        return
      }

      try {
        await this.getWallet(this.currentWalletName, this.currentChainName).disconnect();

        if (
          this.walletStatus === WalletStatus.Disconnected
          && this.autos?.closeModalWhenWalletIsDisconnected
        ) {
          this.emit('modalOpen')?.(false);
        }
      } catch (e) {
        this.emit('message')?.((e as Error).message)
        if (
          this.walletStatus === WalletStatus.Rejected
          && this.autos?.closeModalWhenWalletIsRejected
        ) {
          this.emit('modalOpen')?.(false);
        }
      }

      if (this.useModal) {
        this.setCurrentWallet(undefined, false);
      }
    };
  }

  get openModal() {
    return () => {
      this.emit('modalOpen')?.(true);
    }
  }

  get concurrency() {
    return this._concurrency;
  }
}
