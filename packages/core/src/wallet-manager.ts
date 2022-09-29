import { Chain } from '@chain-registry/types';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';

import { StateBase } from './bases';
import {
  ChainInfo,
  EndpointOptions,
  ManagerActions,
  SignerOptions,
  State,
  WalletOption,
  WalletData,
  WalletStatus,
  Actions,
  ChainName,
  ViewOptions,
  WalletName,
  WalletAdapter,
  StorageOptions,
} from './types';
import { convertChain } from './utils';

export class WalletManager extends StateBase<WalletData> {
  protected _currentWalletName?: WalletName;
  protected _currentChainName?: ChainName;
  protected _useView = true;
  protected _concurrency?: number;
  declare actions?: ManagerActions<WalletData>;
  wallets: WalletOption[];
  chains: ChainInfo[];
  viewOptions: ViewOptions = {
    closeViewWhenWalletIsConnected: false,
    closeViewWhenWalletIsDisconnected: true,
    closeViewWhenWalletIsRejected: false,
  };
  storageOptions: StorageOptions = {
    disabled: false,
    duration: 108000,
    clearOnTabClose: false
  };

  constructor(
    chains: Chain[],
    wallets: WalletOption[],
    signerOptions?: SignerOptions,
    viewOptions?: ViewOptions,
    endpointOptions?: EndpointOptions,
    storageOptions?: StorageOptions
  ) {
    super();
    this.wallets = wallets;
    this.chains = chains.map((chain) =>
      convertChain(chain, signerOptions, endpointOptions?.[chain.chain_name])
    );
    console.info(
      `${this.walletCount} wallets and ${this.chainCount} chains are used!`
    );
    this.wallets.forEach((wallet) => { wallet.setChains(this.chains) });
    this.viewOptions = { ...this.viewOptions, ...viewOptions };
    this.storageOptions = { ...this.storageOptions, ...storageOptions };
  }

  get useView() {
    return this._useView;
  }

  get useStorage() {
    return !this.storageOptions.disabled;
  }

  get currentWalletName() {
    return this._currentWalletName;
  }

  get currentChainName() {
    return this._currentChainName;
  }

  get currentWallet(): WalletAdapter | undefined {
    return this.getWallet(this.currentWalletName, this.currentChainName);
  }

  get data(): WalletData | undefined {
    return this.currentWallet?.data;
  }

  get state() {
    return this.currentWallet?.state || State.Init;
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

  get walletNames() {
    return this.wallets.map((wallet) => wallet.walletName);
  }

  get walletCount() {
    return this.walletNames.length;
  }

  get chainNames() {
    return this.chains.map((chain) => chain.name);
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

  get emitViewOpen() {
    return this.actions?.viewOpen;
  }

  getStargateClient = async (): Promise<SigningStargateClient | undefined> => {
    return await this.currentWallet?.getStargateClient();
  };

  getCosmWasmClient = async (): Promise<SigningCosmWasmClient | undefined> => {
    return await this.currentWallet?.getCosmWasmClient();
  };

  setActions(actions: Actions) {
    this.actions = actions;
  }

  setViewOptions(viewOptions: ViewOptions) {
    this.viewOptions = viewOptions;
  }

  reset() {
    this.currentWallet?.reset();
  }

  private storeCurrent() {
    const storeObj = {
      currentWalletName: this.currentWalletName,
      currentChainName: this.currentChainName
    }
    window?.localStorage.setItem('walletManager', JSON.stringify(storeObj));
    if (this.storageOptions.duration) {
      setTimeout(() => {
        window?.localStorage.removeItem('walletManager');
      }, this.storageOptions.duration)
    }
  }

  setCurrentWallet = (walletName?: WalletName) => {
    this.reset();
    this._currentWalletName = walletName;
    this.emitWalletName?.(walletName);
    if (this.useStorage) {
      this.storeCurrent();
    }
  };

  setCurrentChain = (chainName?: ChainName) => {
    this.reset();
    this._currentChainName = chainName;
    this.emitChainName?.(chainName);
    if (this.useStorage) {
      this.storeCurrent();
    }
  };

  private getWallet(
    walletName?: WalletName,
    chainName?: ChainName
  ): WalletAdapter | undefined {
    if (!walletName) {
      return undefined;
    }

    let wallet: WalletAdapter | undefined = this.wallets.find(
      (w) => w.walletName === walletName
    );

    if (!wallet) {
      throw new Error(`${walletName} is not provided!`);
    }
    if (chainName) {
      wallet = wallet.getChain(chainName);
    }
    wallet.actions = this.actions;
    return wallet;
  }

  update = () => { };

  connect = async () => {
    if (!this.currentWalletName) {
      this.openView();
      return;
    }
    try {
      await this.currentWallet!.connect();
      if (
        this.walletStatus === WalletStatus.Connected &&
        this.viewOptions?.closeViewWhenWalletIsConnected
      ) {
        this.emitViewOpen?.(false);
      }
    } catch (error) {
      console.error(error);
      if (
        this.walletStatus === WalletStatus.Rejected &&
        this.viewOptions?.closeViewWhenWalletIsRejected
      ) {
        this.emitViewOpen?.(false);
      }
    }
  };

  disconnect = async () => {
    if (!this.currentWalletName) {
      this.setMessage('Current Wallet not defined.');
      return;
    }

    try {
      await this.currentWallet!.disconnect();

      if (
        this.walletStatus === WalletStatus.Disconnected &&
        this.viewOptions?.closeViewWhenWalletIsDisconnected
      ) {
        this.emitViewOpen?.(false);
      }
    } catch (e) {
      this.setMessage((e as Error).message);
      if (
        this.walletStatus === WalletStatus.Rejected &&
        this.viewOptions?.closeViewWhenWalletIsRejected
      ) {
        this.emitViewOpen?.(false);
      }
    }

    if (this.useView) {
      this.setCurrentWallet(undefined);
    }
  };

  openView = () => {
    this.emitViewOpen?.(true);
  };

  closeView = () => {
    this.emitViewOpen?.(false);
  };
}
