import { ChainWalletBase } from './bases';
import { ChainWalletContext, WalletStatus } from './types';

export class ChainWalletConverter<T extends ChainWalletBase> {
  wallet: T | undefined;

  constructor(wallet: T | undefined) {
    this.wallet = wallet;
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

  getChainWalletContext(
    chainId: string,
    sync: boolean = true
  ): ChainWalletContext {
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

      connect: () =>
        this.assertWallet(this.wallet?.connect, [void 0, sync], 'connect'),
      disconnect: () =>
        this.assertWallet(
          this.wallet?.disconnect,
          [void 0, sync],
          'disconnect'
        ),
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

      qrUrl: this.wallet?.client?.qrUrl,
      appUrl: this.wallet?.client?.appUrl,

      enable: () =>
        this.assertWalletClient(
          this.wallet?.client?.enable?.bind(this.wallet?.client),
          [[chainId]],
          'enable'
        ),
      getAccount: () =>
        this.assertWalletClient(
          this.wallet?.client?.getAccount.bind(this.wallet?.client),
          [[chainId]],
          'getAccount'
        ),
      sign: (doc: any) =>
        this.assertWalletClient(
          this.wallet?.client?.sign.bind(this.wallet?.client),
          [this.wallet?.address, doc],
          'sign'
        ),
      disable: () =>
        this.assertWalletClient(
          this.wallet?.client?.disable?.bind(this.wallet?.client),
          [[chainId]],
          'disable'
        ),
    };
  }
}
