import { Chain } from '@chain-registry/types';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient } from '@cosmjs/stargate';

import { StateBase } from './bases';
import {
  ChainRecord,
  EndpointOptions,
  ManagerActions,
  SignerOptions,
  State,
  Wallet,
  WalletData,
  WalletStatus,
} from './types';
import {
  Actions,
  ChainName,
  ViewOptions,
  WalletAdapter,
  WalletName,
} from './types';
import { convertChain } from './utils';

export class WalletManager extends StateBase<WalletData> {
  protected _currentWalletName?: WalletName;
  protected _currentChainName?: ChainName;
  protected _useView = true;
  protected _concurrency?: number;
  declare actions?: ManagerActions<WalletData>;
  wallets: Wallet[];
  chains: ChainRecord[];
  viewOptions: ViewOptions = {
    closeViewWhenWalletIsConnected: false,
    closeViewWhenWalletIsDisconnected: true,
    closeViewWhenWalletIsRejected: false,
  };

  constructor(
    chains: Chain[],
    wallets: Wallet[],
    signerOptions?: SignerOptions,
    viewOptions?: ViewOptions,
    endpointOptions?: EndpointOptions,
    _concurrency?: number
  ) {
    super();
    this._concurrency = _concurrency;
    this.wallets = wallets;
    this.chains = chains.map((chain) =>
      convertChain(chain, signerOptions, endpointOptions?.[chain.chain_name])
    );
    console.info(
      `${this.walletCount} wallets and ${this.chainCount} chains are used!`
    );
    this.wallets.forEach((item) => {
      item.wallet.setSupportedChains(this.chains);
    });
    this.viewOptions = { ...this.viewOptions, ...viewOptions };
  }

  get useView() {
    return this._useView;
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
    return this.wallets.map((item) => item.name);
  }

  get walletCount() {
    return this.walletNames.length;
  }

  get chainNames() {
    return this.chains.map((item) => item.name);
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

  setCurrentWallet = (walletName?: WalletName) => {
    this.reset();
    this._currentWalletName = walletName;
    this.emitWalletName?.(walletName);
  };

  setCurrentChain = (chainName?: ChainName) => {
    this.reset();
    this._currentChainName = chainName;
    this.emitChainName?.(chainName);
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
    )?.wallet;

    if (!wallet) {
      throw new Error(`${walletName} is not provided!`);
    }

    if (chainName) {
      wallet = wallet.getChain(chainName);
    }
    wallet.actions = this.actions;
    return wallet;
  }

  update = () => {};

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
