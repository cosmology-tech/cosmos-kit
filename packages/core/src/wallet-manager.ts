/* eslint-disable no-console */
import { AssetList, Chain } from '@chain-registry/types';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';

import { StateBase } from './bases';
import {
  Actions,
  ChainInfo,
  ChainName,
  EndpointOptions,
  ManagerActions,
  SessionOptions,
  SignerOptions,
  State,
  StorageOptions,
  ViewOptions,
  WalletAdapter,
  WalletData,
  WalletName,
  WalletOption,
  WalletStatus,
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
    alwaysOpenView: false,
    closeViewWhenWalletIsConnected: false,
    closeViewWhenWalletIsDisconnected: true,
    closeViewWhenWalletIsRejected: false,
  };
  storageOptions: StorageOptions = {
    disabled: false,
    duration: 1800000,
    clearOnTabClose: false,
  };
  sessionOptions: SessionOptions = {
    duration: 1800000,
    killOnTabClose: false,
  };

  constructor(
    chains: Chain[],
    assetLists: AssetList[],
    wallets: WalletOption[],
    signerOptions?: SignerOptions,
    viewOptions?: ViewOptions,
    endpointOptions?: EndpointOptions,
    storageOptions?: StorageOptions,
    sessionOptions?: SessionOptions
  ) {
    super();
    this.wallets = wallets;
    switch (this.walletCount) {
      case 0:
        throw new Error('No wallet provided.');
      case 1:
        this.setCurrentWallet(this.wallets[0].name);
        break;
      default:
        break;
    }
    this.chains = chains.map((chain) =>
      convertChain(
        chain,
        assetLists,
        signerOptions,
        endpointOptions?.[chain.chain_name]
      )
    );
    switch (this.chainCount) {
      case 0:
        throw new Error('No chain provided.');
      case 1:
        this.setCurrentChain(this.chains[0].name);
        break;
      default:
        break;
    }
    console.info(
      `${this.walletCount} wallets and ${this.chainCount} chains are used!`
    );
    this.wallets.forEach((wallet) => {
      wallet.setChains(this.chains);
    });
    this.viewOptions = { ...this.viewOptions, ...viewOptions };
    this.storageOptions = { ...this.storageOptions, ...storageOptions };
    this.sessionOptions = { ...this.sessionOptions, ...sessionOptions };
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
    return this.wallets.map((wallet) => wallet.name);
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

  reset() {
    this.currentWallet?.reset();
  }

  private storeCurrent() {
    const storeObj = {
      currentWalletName: this.currentWalletName,
      currentChainName: this.currentChainName,
    };
    window?.localStorage.setItem('walletManager', JSON.stringify(storeObj));
    if (this.storageOptions.duration) {
      setTimeout(() => {
        window?.localStorage.removeItem('walletManager');
      }, this.storageOptions.duration);
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
      (w) => w.name === walletName
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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  update = () => {};

  connect = async () => {
    if (!this.currentWalletName) {
      this.openView();
      return;
    }
    if (this.viewOptions?.alwaysOpenView) {
      this.openView();
    }
    try {
      await this.currentWallet.connect(this.sessionOptions);
      if (
        this.walletStatus === WalletStatus.Connected &&
        this.viewOptions?.closeViewWhenWalletIsConnected
      ) {
        this.closeView();
      }
    } catch (error) {
      console.error(error);
      if (
        this.walletStatus === WalletStatus.Rejected &&
        this.viewOptions?.closeViewWhenWalletIsRejected
      ) {
        this.closeView();
      }
    }
  };

  disconnect = async () => {
    if (!this.currentWalletName) {
      this.setMessage('Current Wallet not defined.');
      return;
    }
    if (this.viewOptions?.alwaysOpenView) {
      this.openView();
    }
    try {
      await this.currentWallet.disconnect();

      if (
        this.walletStatus === WalletStatus.Disconnected &&
        this.viewOptions?.closeViewWhenWalletIsDisconnected
      ) {
        this.closeView();
      }
    } catch (e) {
      this.setMessage((e as Error).message);
      if (
        this.walletStatus === WalletStatus.Rejected &&
        this.viewOptions?.closeViewWhenWalletIsRejected
      ) {
        this.closeView();
      }
    }

    if (this.walletCount > 1) {
      this.setCurrentWallet(undefined);
    }
  };

  openView = () => {
    this.emitViewOpen?.(true);
  };

  closeView = () => {
    this.closeView();
  };
}
