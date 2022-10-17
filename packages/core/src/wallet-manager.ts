/* eslint-disable no-console */
import { AssetList, Chain } from '@chain-registry/types';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';

import { StateBase } from './bases';
import {
  Actions,
  BrowserEnv,
  Callbacks,
  ChainName,
  ChainRecord,
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
} from './types';
import { convertChain } from './utils';

export class WalletManager extends StateBase<WalletData> {
  protected _currentWalletName?: WalletName;
  protected _currentChainName?: ChainName;
  declare actions?: ManagerActions<WalletData>;
  declare env?: BrowserEnv;
  wallets: WalletOption[];
  chains: ChainRecord[];
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
    if (wallets.length === 0) {
      throw new Error('No wallet provided.');
    }
    if (chains.length === 0) {
      throw new Error('No chain provided.');
    }
    this.wallets = wallets;
    this.chains = chains.map((chain) =>
      convertChain(
        chain,
        assetLists,
        signerOptions,
        endpointOptions?.[chain.chain_name]
      )
    );
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

  get useStorage() {
    return !this.storageOptions.disabled;
  }

  get currentWalletName() {
    if (!this._currentWalletName && this.walletCount === 1) {
      return this.wallets[0].walletName;
    }
    return this._currentWalletName;
  }

  get currentChainName() {
    if (!this._currentChainName && this.chainCount === 1) {
      return this.chains[0].name;
    }
    return this._currentChainName;
  }

  get currentWallet(): WalletAdapter | undefined {
    return this.getWallet(this.currentWalletName, this.currentChainName);
  }

  get currentChain(): ChainRecord | undefined {
    return this.getChain(this.currentChainName);
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

  private get emitWalletName() {
    return this.actions?.walletName;
  }

  private get emitChainName() {
    return this.actions?.chainName;
  }

  private get emitViewOpen() {
    return this.actions?.viewOpen;
  }

  getStargateClient = async (): Promise<SigningStargateClient | undefined> => {
    return await this.currentWallet?.getSigningStargateClient();
  };

  getCosmWasmClient = async (): Promise<SigningCosmWasmClient | undefined> => {
    return await this.currentWallet?.getSigningCosmWasmClient();
  };

  setActions = (actions: Actions) => {
    this.actions = actions;
  };

  reset = () => {
    this.currentWallet?.reset();
  };

  private updateCurrentStore = () => {
    if (!this.useStorage) {
      return;
    }
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
  };

  setCurrentWallet = (walletName?: WalletName) => {
    this.reset();
    this._currentWalletName = walletName;
    this.emitWalletName?.(walletName);
  };

  setCurrentChain = (chainName?: ChainName, noUpdateStore?: boolean) => {
    this.reset();
    this._currentChainName = chainName;
    this.emitChainName?.(chainName);
    if (!noUpdateStore) {
      this.updateCurrentStore();
    }
  };

  getWallet = (
    walletName?: WalletName,
    chainName?: ChainName
  ): WalletAdapter | undefined => {
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
      wallet = wallet.getChainWallet(chainName);
    }
    wallet.actions = this.actions;
    return wallet;
  };

  getChain = (chainName?: ChainName): ChainRecord | undefined => {
    if (!chainName) {
      return undefined;
    }

    const chainRecord: ChainRecord | undefined = this.chains.find(
      (c) => c.name === chainName
    );

    if (!chainRecord) {
      throw new Error(`${chainName} is not provided!`);
    }
    return chainRecord;
  };

  // get chain logo
  getChainLogo = (chainName?: ChainName): string | undefined => {
    const chainRecord = this.getChain(chainName);
    return (
      // until chain_registry fix this
      // chainRecord?.chain.logo_URIs?.svg ||
      // chainRecord?.chain.logo_URIs?.png ||
      // chainRecord?.chain.logo_URIs?.jpeg ||
      chainRecord?.assetList?.assets[0]?.logo_URIs?.svg ||
      chainRecord?.assetList?.assets[0]?.logo_URIs?.png ||
      undefined
    );
  };

  private get callbacks(): Callbacks {
    return {
      connect: () => {
        this.updateCurrentStore();
      },
      disconnect: () => {
        this.setCurrentWallet(undefined);
        this.updateCurrentStore();
      },
    };
  }

  connect = async () => {
    if (!this.currentWalletName) {
      this.openView();
      return;
    }
    if (this.viewOptions?.alwaysOpenView) {
      this.openView();
    }
    try {
      await this.currentWallet.connect(this.sessionOptions, this.callbacks);
      if (
        this.isWalletConnected &&
        this.viewOptions?.closeViewWhenWalletIsConnected
      ) {
        this.closeView();
      }
    } catch (error) {
      console.error(error);
      if (
        this.isWalletRejected &&
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
      await this.currentWallet.disconnect(this.callbacks);

      console.log(12, this.currentWallet.data);
      console.log(23, this.data);

      if (
        this.isWalletConnected &&
        this.viewOptions?.closeViewWhenWalletIsDisconnected
      ) {
        this.closeView();
      }
    } catch (e) {
      this.setMessage((e as Error).message);
      if (
        this.isWalletRejected &&
        this.viewOptions?.closeViewWhenWalletIsRejected
      ) {
        this.closeView();
      }
    }
  };

  openView = () => {
    this.emitViewOpen?.(true);
  };

  closeView = () => {
    this.emitViewOpen?.(false);
  };
}
