import {
  Callbacks,
  ChainName,
  ChainRecord,
  EndpointOptions,
  IChainWallet,
  MainWalletData,
  State,
  Wallet,
  WalletClient,
} from '../types';
import { ChainWalletBase } from './chain-wallet';
import { WalletBase } from './wallet';

export abstract class MainWalletBase extends WalletBase<MainWalletData> {
  protected _chainWallets: Map<ChainName, ChainWalletBase>;
  preferredEndpoints?: EndpointOptions;
  ChainWallet: IChainWallet;

  constructor(walletInfo: Wallet, ChainWallet: IChainWallet) {
    super(walletInfo);
    this.ChainWallet = ChainWallet;
    this.clientPromise = this.fetchClient();
  }

  protected setChainsCallback(): void {
    this.chainWallets.forEach((chainWallet) => {
      chainWallet.clientPromise = this.clientPromise;
    });
  }

  setChains(chains: ChainRecord[]): void {
    this._chainWallets = new Map(
      chains.map((chain) => {
        chain.preferredEndpoints = {
          rpc: [
            ...(chain.preferredEndpoints?.rpc || []),
            ...(this.preferredEndpoints?.[chain.name]?.rpc || []),
            `https://rpc.cosmos.directory/${chain.name}`,
            ...(chain.chain?.apis?.rpc?.map((e) => e.address) || []),
          ],
          rest: [
            ...(chain.preferredEndpoints?.rest || []),
            ...(this.preferredEndpoints?.[chain.name]?.rest || []),
            `https://rest.cosmos.directory/${chain.name}`,
            ...(chain.chain?.apis?.rest?.map((e) => e.address) || []),
          ],
        };

        return [chain.name, new this.ChainWallet(this.walletInfo, chain)];
      })
    );

    this.setChainsCallback();
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  get chainWallets() {
    return this._chainWallets;
  }

  getChainWallet(chainName: string): ChainWalletBase {
    if (!this.chainWallets.has(chainName)) {
      throw new Error(`Unknown chain name: ${chainName}`);
    } else {
      return this.chainWallets.get(chainName);
    }
  }

  async update(callbacks?: Callbacks) {
    if (!this.client) {
      this.setClientNotExist();
      return;
    }
    this.setState(State.Done);
    callbacks?.connect?.();
  }

  disconnect(callbacks?: Callbacks) {
    this.chainWallets.forEach((chain) => {
      chain.disconnect();
    });
    this.reset();
    callbacks?.disconnect?.();
  }

  abstract fetchClient():
    | WalletClient
    | undefined
    | Promise<WalletClient | undefined>;
}
