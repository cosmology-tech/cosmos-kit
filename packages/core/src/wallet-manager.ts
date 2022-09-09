import { ChainWalletBase, MainWalletBase } from './bases';
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
    this.walletRepo = createWalletRepo(wallets, true);
    this.chainRepo = createChainRepo(chains, true);
    this.walletRepo.registeredItemMap.forEach((item) => {
      item.wallet.setSupportedChains(this.chainRepo.activeNames);
    });
  }

  private get sharedActions() {
    return {
      qrUri: this.emitQrUri,
      modalOpen: this.emitModalOpen,
      message: this.emitMessage
    }
  }

  private get walletActions() {
    return {
      state: this.emitWalletState,
      data: this.emitWalletData,
      ...this.sharedActions
    };
  }

  private get chainWalletActions() {
    return {
      state: this.emitChainWalletState,
      data: this.emitChainWalletData,
      ...this.sharedActions
    };
  }

  setAction(actions: Actions) {
    this.actions = actions;
  }

  setAutos(autos: Autos) {
    this.autos = autos;
  }

  get autoConnect() {
    return Boolean(this.autos?.connectWhenCurrentChanges);
  }

  get currentWalletName() {
    return this._currentWalletName;
  }

  setCurrentWallet(walletName?: WalletName) {
    this.emitWalletDisconnect();
    this._currentWalletName = walletName;
    this.emitWalletName?.(walletName);
    if (this.autoConnect) {
      this.connect();
    }
  }

  get currentChainName() {
    return this._currentChainName;
  }

  setCurrentChain(chainName?: ChainName) {
    this.emitChainWalletDisconnect();
    this._currentChainName = chainName;
    this.emitChainName?.(chainName);
    if (this.autoConnect) {
      this.connect();
    }
  }

  get useModal() {
    return this._useModal;
  }

  get emitChainName() {
    return this.actions?.chainName;
  }

  get emitWalletName() {
    return this.actions?.walletName;
  }

  get emitWalletState() {
    return this.actions?.walletState;
  }

  get emitWalletData() {
    return this.actions?.walletData;
  }

  get emitChainWalletState() {
    return this.actions?.chainWalletState;
  }

  get emitChainWalletData() {
    return this.actions?.chainWalletData;
  }

  get emitModalOpen() {
    return this.actions?.modalOpen;
  }

  get emitQrUri() {
    return this.actions?.qrUri;
  }

  get emitMessage() {
    return this.actions?.message;
  }

  emitWalletDisconnect() {
    this.emitWalletData?.(undefined);
    this.emitMessage?.(undefined);
    this.emitWalletState?.(State.Init);
  }

  emitChainWalletDisconnect() {
    this.emitChainWalletData?.(undefined);
    this.emitMessage?.(undefined);
    this.emitChainWalletState?.(State.Init);
  }

  get username() {
    return this.currentWallet?.username;
  }

  get address() {
    return this.currentChainWallet?.address;
  }

  get activeWallets() {
    return this.walletRepo.activeItems;
  }

  get walletNames() {
    return this.walletRepo.activeItems.map((item) => item.name);
  }

  get walletCount() {
    return this.walletNames.length;
  }

  get state() {
    return this.currentChainName
      ? this.currentChainWallet?.state
      : this.currentWallet?.state;
  }

  get message() {
    return this.currentChainName
      ? this.currentChainWallet?.message
      : this.currentWallet?.message;
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
      walletNameInfo.forEach((name) => {
        this.walletRepo.activate(name);
      });
      this._useModal = true;
    } else {
      this.walletRepo.activate(walletNameInfo);
      this.setCurrentWallet(walletNameInfo);
      this._useModal = false;
    }
  }

  get activeChains() {
    return this.chainRepo.activeItems;
  }

  get chainNames() {
    return this.chainRepo.activeItems.map((item) => item.name);
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
      item.wallet.setSupportedChains(chainNames);
    });
  }

  getWallet(walletName: WalletName): MainWalletBase<any, any, any> {
    return this.walletRepo.getItem(walletName).wallet;
  }

  get currentWallet() {
    return this.currentWalletName
      ? this.getWallet(this.currentWalletName)
      : undefined;
  }

  get currentChainWallet(): ChainWalletBase<any, any> | undefined {
    return this.currentChainName
      ? this.currentWallet?.getChain(this.currentChainName)
      : undefined;
  }

  getChainConnect(walletName: WalletName, chainName: ChainName, emit = true) {
    return async () => {
      const chainWallet = this.getWallet(walletName).getChain(chainName);
      chainWallet.actions = this.chainWalletActions;
      await chainWallet.connect();
    };
  }

  getConnect(walletName: WalletName) {
    return async () => {
      const wallet = this.getWallet(walletName);
      wallet.actions = this.walletActions;
      await wallet.connect();
    };
  }

  get connect() {
    return async () => {
      if (!this.currentWalletName) {
        console.info('Cannot connect with undefined currentWalletName');
        return
      }
      try {
        if (this.currentChainName) {
          await this.getChainConnect(
            this.currentWalletName,
            this.currentChainName
          )();
        } else {
          await this.getConnect(this.currentWalletName)();
        }
        if (this.autos?.closeModalWhenWalletIsConnected) {
          this.emitModalOpen(false);
        }
      } catch (error) {
        console.error(error);
        if (this.autos?.closeModalWhenWalletIsRejected) {
          this.emitModalOpen(false);
        }
      }
    };
  }

  getChainDisconnect(walletName: WalletName, chainName: ChainName) {
    return async () => {
      const chainWallet = this.getWallet(walletName).getChain(chainName);
      chainWallet.actions = this.chainWalletActions;
      await chainWallet.disconnect();
    };
  }

  getDisconnect(walletName: WalletName) {
    return async () => {
      const wallet = this.getWallet(walletName);
      wallet.actions = this.walletActions;
      wallet.disconnect();
    };
  }

  get disconnect() {
    return async () => {
      if (!this.currentWalletName) {
        throw new Error('Wallet not selected!');
      }

      try {
        if (this.currentChainName) {
          await this.getChainDisconnect(
            this.currentWalletName,
            this.currentChainName
          )();
        } else {
          await this.getDisconnect(this.currentWalletName)();
        }

        if (this.autos?.closeModalWhenWalletIsDisconnected) {
          this.emitModalOpen(false);
        }
      } catch (error) {
        console.error(error);
        if (this.autos?.closeModalWhenWalletIsRejected) {
          this.emitModalOpen(false);
        }
      }

      if (this.useModal) {
        this.setCurrentWallet(undefined);
      }
    };
  }

  get concurrency() {
    return this._concurrency;
  }
}
