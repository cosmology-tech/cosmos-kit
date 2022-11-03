/* eslint-disable no-console */
import { AssetList, Chain } from '@chain-registry/types';
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate';
import { EncodeObject, OfflineSigner } from '@cosmjs/proto-signing';
import {
  SigningStargateClient,
  StargateClient,
  StdFee,
} from '@cosmjs/stargate';
import { isAndroid, isMobile } from '@walletconnect/browser-utils';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

import { ChainWalletBase, MainWalletBase, StateBase } from './bases';
import {
  Actions,
  AppEnv,
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
  Wallet,
  WalletAdapter,
  WalletData,
  WalletName,
} from './types';
import { convertChain } from './utils';

export class WalletManager extends StateBase<WalletData> {
  private _currentWalletName?: WalletName;
  private _currentChainName?: ChainName;
  declare actions?: ManagerActions<WalletData>;
  private _wallets: MainWalletBase[];
  chainRecords: ChainRecord[];
  env?: AppEnv;
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
    wallets: MainWalletBase[],
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
    this._wallets = wallets;
    this.chainRecords = chains.map((chain) =>
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
    this._wallets.forEach((wallet) => {
      wallet.setChains(this.chainRecords);
    });
    this.viewOptions = { ...this.viewOptions, ...viewOptions };
    this.storageOptions = { ...this.storageOptions, ...storageOptions };
    this.sessionOptions = { ...this.sessionOptions, ...sessionOptions };
  }

  get wallets() {
    if (this.env?.isMobile) {
      return this._wallets.filter(
        (wallet) => !wallet.walletInfo.mobileDisabled
      );
    }
    return this._wallets;
  }

  get useStorage() {
    return !this.storageOptions.disabled;
  }

  get currentWalletName() {
    if (!this._currentWalletName && this.walletCount === 1) {
      return this._wallets[0].walletName;
    }
    return this._currentWalletName;
  }

  get currentChainName() {
    if (!this._currentChainName && this.chainCount === 1) {
      return this.chainRecords[0].name;
    }
    return this._currentChainName;
  }

  get currentWallet(): WalletAdapter | undefined {
    return this.getWallet(this.currentWalletName, this.currentChainName);
  }

  get currentWalletInfo(): Wallet | undefined {
    return this.currentWallet?.walletInfo;
  }

  get currentChainRecord(): ChainRecord | undefined {
    return this.getChainRecord(this.currentChainName);
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
    return this._wallets.map((wallet) => wallet.walletName);
  }

  get walletCount() {
    return this.walletNames.length;
  }

  get chainNames() {
    return this.chainRecords.map((chain) => chain.name);
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

  enable = async (chainIds: string | string[]): Promise<void> => {
    await this.currentWallet?.client?.enable?.(chainIds);
  };

  getStargateClient = async (): Promise<StargateClient | undefined> => {
    return await (this.currentWallet as ChainWalletBase)?.getStargateClient?.();
  };

  getCosmWasmClient = async (): Promise<CosmWasmClient | undefined> => {
    return await (this.currentWallet as ChainWalletBase)?.getCosmWasmClient?.();
  };

  getSigningStargateClient = async (): Promise<
    SigningStargateClient | undefined
  > => {
    return await (
      this.currentWallet as ChainWalletBase
    )?.getSigningStargateClient?.();
  };

  getSigningCosmWasmClient = async (): Promise<
    SigningCosmWasmClient | undefined
  > => {
    return await (
      this.currentWallet as ChainWalletBase
    )?.getSigningCosmWasmClient?.();
  };

  sign = async (
    messages: EncodeObject[],
    fee: StdFee,
    memo?: string,
    type?: string
  ): Promise<TxRaw> => {
    return await (this.currentWallet as ChainWalletBase)?.sign?.(
      messages,
      fee,
      memo,
      type
    );
  };

  broadcast = async (signedMessages: TxRaw, type?: string) => {
    return await (this.currentWallet as ChainWalletBase)?.broadcast?.(
      signedMessages,
      type
    );
  };

  signAndBroadcast = async (
    messages: EncodeObject[],
    fee?: StdFee,
    memo?: string,
    type?: string
  ) => {
    return await (this.currentWallet as ChainWalletBase)?.signAndBroadcast?.(
      messages,
      fee,
      memo,
      type
    );
  };

  setActions = (actions: Actions) => {
    this.actions = actions;
  };

  reset = () => {
    this.currentWallet?.reset();
  };

  private updateLocalStorage = (target: string) => {
    if (!this.useStorage) {
      return;
    }

    let storeObj = {};
    const storeStr = window?.localStorage.getItem('cosmos-kit');
    if (storeStr) {
      storeObj = JSON.parse(storeStr);
    }
    switch (target) {
      case 'chain':
        storeObj = {
          ...storeObj,
          currentChainName: this.currentChainName,
        };
        break;
      case 'wallet':
        storeObj = {
          ...storeObj,
          currentWalletName: this.currentWalletName,
        };
        break;
      default:
        storeObj = {
          ...storeObj,
          currentWalletName: this.currentWalletName,
          currentChainName: this.currentChainName,
        };
        break;
    }

    window?.localStorage.setItem('cosmos-kit', JSON.stringify(storeObj));
    if (this.storageOptions.duration) {
      setTimeout(() => {
        window?.localStorage.removeItem('cosmos-kit');
      }, this.storageOptions.duration);
    }
  };

  setCurrentWallet = (walletName?: WalletName) => {
    this.reset();
    this._currentWalletName = walletName;
    this.emitWalletName?.(walletName);
  };

  setCurrentChain = (chainName?: ChainName) => {
    this.reset();
    this._currentChainName = chainName;
    this.emitChainName?.(chainName);
    this.updateLocalStorage('chain');
  };

  getWallet = (
    walletName?: WalletName,
    chainName?: ChainName
  ): WalletAdapter | undefined => {
    if (!walletName) {
      return void 0;
    }

    let wallet: WalletAdapter | undefined = this._wallets.find(
      (w) => w.walletName === walletName
    );

    if (!wallet) {
      throw new Error(`${walletName} is not provided!`);
    }
    if (chainName) {
      wallet = (wallet as MainWalletBase).getChainWallet(chainName);
    }
    wallet.actions = this.actions;
    return wallet;
  };

  getChainRecord = (chainName?: ChainName): ChainRecord | undefined => {
    if (!chainName) {
      return void 0;
    }

    const chainRecord: ChainRecord | undefined = this.chainRecords.find(
      (c) => c.name === chainName
    );

    if (!chainRecord) {
      throw new Error(`${chainName} is not provided!`);
    }
    return chainRecord;
  };

  // get chain logo
  getChainLogo = (chainName?: ChainName): string | undefined => {
    const chainRecord = this.getChainRecord(chainName);
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
        this.updateLocalStorage('wallet');
      },
      disconnect: () => {
        this.setCurrentWallet(undefined);
        this.updateLocalStorage('wallet');
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
      this.currentWallet.setEnv(this.env);
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

  private _handleTabLoad = (event?: Event) => {
    event?.preventDefault();
    this.connect();
  };

  private _handleTabClose = (event: Event) => {
    event.preventDefault();
    if (this.storageOptions.clearOnTabClose) {
      window.localStorage.removeItem('cosmos-kit');
    }
    if (this.sessionOptions.killOnTabClose) {
      this.disconnect();
    }
  };

  private _connectEventLisener = async (event: Event) => {
    event.preventDefault();
    if (!this.isInit) {
      await this.connect();
    }
  };

  onMounted = () => {
    if (typeof window === 'undefined') {
      return;
    }

    this.env = {
      isMobile: isMobile(),
      isAndroid: isAndroid(),
    };

    if (this.useStorage) {
      const storeStr = window.localStorage.getItem('cosmos-kit');
      if (storeStr) {
        const { currentWalletName, currentChainName } = JSON.parse(storeStr);
        this.setCurrentWallet(currentWalletName);
        this.setCurrentChain(currentChainName);
        if (currentWalletName) {
          this._handleTabLoad();
          if (document.readyState !== 'complete') {
            window.addEventListener('load', this._handleTabLoad);
          }
        }
      }

      window.addEventListener('beforeunload', this._handleTabClose);

      this.wallets.forEach((wallet) => {
        wallet.walletInfo.connectEventNames?.forEach((eventName) => {
          window.addEventListener(eventName, this._connectEventLisener);
        });
      });
    }
  };

  onUnmounted = () => {
    if (typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('beforeunload', this._handleTabClose);
    window.removeEventListener('load', this._handleTabLoad);

    this.wallets.forEach((wallet) => {
      wallet.walletInfo.connectEventNames?.forEach((eventName) => {
        window.removeEventListener(eventName, this._connectEventLisener);
      });
    });
  };
}
