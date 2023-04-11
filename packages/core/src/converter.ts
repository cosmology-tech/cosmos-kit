import { ChainWallet } from './bases';
import { WalletRepo } from './repository';
import { ChainContext, ChainWalletContext, WalletStatus } from './types';

export class ChainWalletConverter {
  wallet?: ChainWallet;
  walletRepo?: WalletRepo;

  constructor(wallet?: ChainWallet, walletRepo?: WalletRepo) {
    this.wallet = wallet;
    this.walletRepo = walletRepo;
  }

  get chainId() {
    return this.wallet.chain.chain_id;
  }

  protected assertWallet(
    func: ((...params: any[]) => any | undefined) | undefined,
    params: any[] = [],
    name: string
  ) {
    if (!this.wallet) {
      throw new Error(
        `Wallet is undefined. Please choose a wallet to connect first.`
      );
    }

    if (!func) {
      throw new Error(
        `Function ${name} not implemented by ${this.wallet?.walletInfo.prettyName} yet.`
      );
    }

    return func(...params);
  }

  protected assertWalletClient(
    func: ((...params: any[]) => any | undefined) | undefined,
    params: any[] = [],
    name: string
  ) {
    if (!this.wallet) {
      throw new Error(
        `Wallet is undefined. Please choose a wallet to connect first.`
      );
    }

    if (!this.wallet?.client) {
      throw new Error(`Wallet Client is undefined.`);
    }

    if (!func) {
      throw new Error(
        `Function ${name} not implemented by ${this.wallet?.walletInfo.prettyName} Client yet.`
      );
    }

    return func(...params);
  }

  getChainContext(): ChainContext {
    return this._getChainContext();
  }

  getChainWalletContext(): ChainWalletContext {
    return this._getChainWalletContext();
  }

  protected _getChainContext(): ChainContext {
    if (!this.walletRepo) {
      throw new Error(`WalletRepo is undefined.`);
    }

    const {
      connect,
      disconnect,
      openView,
      closeView,
      chainRecord: { chain, assetList },
      getRpcEndpoint,
      getRestEndpoint,
      getNameService,
    } = this.walletRepo;

    return {
      ...this.getChainWalletContext(),
      walletRepo: this.walletRepo,
      chain,
      assets: assetList,
      openView,
      closeView,
      connect: () => connect(),
      disconnect: () => disconnect(),
      getRpcEndpoint,
      getRestEndpoint,
      getNameService,
    };
  }

  protected _getChainWalletContext(): ChainWalletContext {
    const status = this.wallet?.walletStatus || WalletStatus.Disconnected;

    return {
      chainWallet: this.wallet,

      chain: this.wallet?.chainRecord.chain,
      assets: this.wallet?.chainRecord.assetList,
      logoUrl: this.wallet?.chainLogoUrl,
      wallet: this.wallet?.walletInfo,
      address: this.wallet?.address,
      username: this.wallet?.username,
      message: this.wallet
        ? this.wallet.message
        : 'No wallet is connected walletly.',
      status,

      isWalletDisconnected: status === 'Disconnected',
      isWalletConnecting: status === 'Connecting',
      isWalletConnected: status === 'Connected',
      isWalletRejected: status === 'Rejected',
      isWalletNotExist: status === 'NotExist',
      isWalletError: status === 'Error',

      connect: () => this.assertWallet(this.wallet?.connect, [], 'connect'),
      disconnect: () =>
        this.assertWallet(this.wallet?.disconnect, [], 'disconnect'),
      getRpcEndpoint: (isLazy?: boolean) =>
        this.assertWallet(
          this.wallet?.getRpcEndpoint,
          [isLazy],
          'getRpcEndpoint'
        ),
      getRestEndpoint: (isLazy?: boolean) =>
        this.assertWallet(
          this.wallet?.getRestEndpoint,
          [isLazy],
          'getRestEndpoint'
        ),
      getNameService: () =>
        this.assertWallet(this.wallet?.getNameService, [], 'getNameService'),
      sign: (doc: any) =>
        this.assertWallet(this.wallet?.sign, [doc], '_broadcast'),
      broadcast: (doc: any) =>
        this.assertWallet(this.wallet?.broadcast, [doc], '_broadcast'),

      qrUrl: this.wallet?.client?.qrUrl,
      appUrl: this.wallet?.client?.appUrl,

      getAccounts: () =>
        this.assertWalletClient(
          this.wallet?.client?.getAccounts.bind(this.wallet?.client),
          [[this.chainId]],
          'getAccounts'
        ),
    };
  }
}
