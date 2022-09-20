import { OfflineSigner } from '@cosmjs/proto-signing';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClient } from '@cosmjs/stargate';

import { Wallet, ManagerActions, WalletData, WalletStatus } from './types';
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
  ChainInfo,
  WalletName,
  WalletInfo,
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
    chains?: ChainInfo[],
    wallets?: WalletInfo[],
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

  get useModal() {
    return this._useModal;
  }

  get currentWalletName() {
    return this._currentWalletName;
  }

  get currentChainName() {
    return this._currentChainName;
  }

  get currentWallet(): Wallet | undefined {
    return this.getWallet(this.currentWalletName, this.currentChainName);
  }

  get data(): WalletData {
    return this.currentWallet?.data;
  }

  get state() {
    return this.currentWallet?.state;
  }

  get message() {
    return this.currentWallet?.message;
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  get address(): string | undefined {
    return this.data?.address;
  }

  get offlineSigner(): OfflineSigner | undefined {
    return this.data?.offlineSigner;
  }

  get stargateClient(): Promise<SigningStargateClient | undefined> {
    return this.currentWallet?.stargateClient;
  }

  get cosmwasmClient(): Promise<SigningCosmWasmClient | undefined> {
    return this.currentWallet?.cosmwasmClient;
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

  get activeChains() {
    return this.chainRepo.activeItems;
  }

  get chainNames() {
    return this.activeChains.map((item) => item.name);
  }

  get chainCount() {
    return this.chainNames.length;
  }

  get concurrency() {
    return this._concurrency;
  }

  emit(type: string) {
    return this.actions?.[type];
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

  reset() {
    this.currentWallet?.reset();
  }

  setCurrentWallet = (walletName?: WalletName) => {
    this.reset();
    this._currentWalletName = walletName;
    this.emitWalletName?.(walletName);
  }

  setCurrentChain = (chainName?: ChainName) => {
    this.reset();
    this._currentChainName = chainName;
    this.emitChainName?.(chainName);
  }

  useWallets = (walletNameInfo: WalletName[] | WalletName) => {
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

  useChains = (chainNames: ChainName[]) => {
    this.chainRepo.inactivateAll();
    chainNames.forEach((name) => {
      this.chainRepo.activate(name);
    });
    this.walletRepo.registeredItemMap.forEach((item) => {
      item.wallet.setSupportedChains(this.chainRepo.activeItems);
    });
    console.info(`${this.chainCount} chains are used!`)
  }

  private getWallet(walletName?: WalletName, chainName?: ChainName): Wallet | undefined {
    if (!walletName) {
      return undefined;
    }

    let wallet: Wallet | undefined = this.walletRepo.getItem(walletName).wallet;
    if (chainName) {
      wallet = wallet.getChain(chainName);
    }
    wallet.actions = this.actions;
    return wallet;
  }

  update = () => { }

  connect = async () => {
    if (!this.currentWalletName) {
      this.openModal();
      return
    }
    try {
      await this.currentWallet.connect();

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
  }

  disconnect = async () => {
    if (!this.currentWalletName) {
      this.setMessage('Current Wallet not defined.')
      return
    }

    try {
      await this.currentWallet.disconnect();

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
      this.setCurrentWallet(undefined);
    }
  };

  openModal = () => {
    this.emitModalOpen?.(true);
  }
}
