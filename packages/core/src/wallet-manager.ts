import { ChainWalletBase, MainWalletBase } from './bases';
import {
  ChainRepo,
  createChainRepo,
  createWalletRepo,
  WalletRepo,
} from './repositories';
import {
  Actions,
  ChainName,
  ChainRegistry,
  State,
  WalletName,
  WalletRegistry,
} from './types';

export class WalletManager {
  protected _currentWalletName?: WalletName;
  protected _currentChainName?: ChainName;
  protected _useModal = true;
  actions?: Actions;
  walletRepo: WalletRepo;
  chainRepo: ChainRepo;
  autoConnect = true;

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

  private get walletActions() {
    return {
      state: this.emitWalletState,
      data: this.emitWalletData,
      qrUri: this.emitQrUri,
      openModal: this.emitOpenModal,
    };
  }

  private get chainWalletActions() {
    return {
      state: this.emitChainWalletState,
      data: this.emitChainWalletData,
      qrUri: this.emitQrUri,
      openModal: this.emitOpenModal,
    };
  }

  updateAction(actions: Actions) {
    this.actions = { ...this.actions, ...actions };
  }

  get currentWalletName() {
    return this._currentWalletName;
  }

  setCurrentWallet(walletName?: WalletName) {
    this.emitWalletDisconnect();
    this._currentWalletName = walletName;
    this.emitWalletName?.(walletName);
  }

  get currentChainName() {
    return this._currentChainName;
  }

  setCurrentChain(chainName?: ChainName) {
    this.emitChainWalletDisconnect();
    this._currentChainName = chainName;
    if (this.currentWalletName && this.autoConnect) {
      this.connect();
    }
  }

  get useModal() {
    return this._useModal;
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

  get emitOpenModal() {
    return this.actions?.openModal;
  }

  get emitQrUri() {
    return this.actions?.qrUri;
  }

  emitWalletDisconnect() {
    this.emitWalletData?.(undefined);
    this.emitWalletState?.(State.Init);
  }

  emitChainWalletDisconnect() {
    this.emitChainWalletData?.(undefined);
    this.emitChainWalletState?.(State.Init);
  }

  get username() {
    return this.currentWallet?.username;
  }

  get address() {
    return this.currentChainWallet?.address;
  }

  get walletInfos() {
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

  get chainInfos() {
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
        throw new Error('Wallet not selected!');
      }
      try {
        await this.getConnect(this.currentWalletName)();
        if (this.currentChainName) {
          await this.getChainConnect(
            this.currentWalletName,
            this.currentChainName
          )();
        }
      } catch (error) {
        console.error(error);
      }

      // this.emitOpenModal && this.emitOpenModal(false);
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
        }
        await this.getDisconnect(this.currentWalletName)();
      } catch (error) {
        console.error(error);
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
