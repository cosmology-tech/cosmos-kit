import {
  ChainWalletBase,
  ChainWalletContext,
  MethodAssertion,
  WalletStatus,
} from '@cosmos-kit/core';

export function getChainWalletContext(
  chainId: string,
  wallet?: ChainWalletBase,
  sync: boolean = true
): ChainWalletContext {
  const ma = new MethodAssertion(wallet);

  const status = wallet?.walletStatus || WalletStatus.Disconnected;

  return {
    chainWallet: wallet,

    chain: wallet?.chainRecord.chain,
    assets: wallet?.chainRecord.assetList,
    logoUrl: wallet?.chainLogoUrl,
    wallet: wallet?.walletInfo,
    address: wallet?.address,
    username: wallet?.username,
    message: wallet ? wallet.message : 'No wallet is connected walletly.',
    status,

    isWalletDisconnected: status === 'Disconnected',
    isWalletConnecting: status === 'Connecting',
    isWalletConnected: status === 'Connected',
    isWalletRejected: status === 'Rejected',
    isWalletNotExist: status === 'NotExist',
    isWalletError: status === 'Error',

    connect: () => ma.assertWallet(wallet?.connect, [void 0, sync], 'connect'),
    disconnect: () =>
      ma.assertWallet(wallet?.disconnect, [void 0, sync], 'disconnect'),
    getRpcEndpoint: (isLazy?: boolean) =>
      ma.assertWallet(wallet?.getRpcEndpoint, [isLazy], 'getRpcEndpoint'),
    getRestEndpoint: (isLazy?: boolean) =>
      ma.assertWallet(wallet?.getRestEndpoint, [isLazy], 'getRestEndpoint'),
    getStargateClient: () =>
      ma.assertWallet(wallet?.getStargateClient, [], 'getStargateClient'),
    getCosmWasmClient: () =>
      ma.assertWallet(wallet?.getCosmWasmClient, [], 'getCosmWasmClient'),
    getSigningStargateClient: () =>
      ma.assertWallet(
        wallet?.getSigningStargateClient,
        [],
        'getSigningStargateClient'
      ),
    getSigningCosmWasmClient: () =>
      ma.assertWallet(
        wallet?.getSigningCosmWasmClient,
        [],
        'getSigningCosmWasmClient'
      ),
    getNameService: () =>
      ma.assertWallet(wallet?.getNameService, [], 'getNameService'),

    estimateFee: (...params: Parameters<ChainWalletContext['estimateFee']>) =>
      ma.assertWallet(wallet?.estimateFee, params, 'estimateFee'),
    sign: (...params: Parameters<ChainWalletContext['sign']>) =>
      ma.assertWallet(wallet?.sign, params, 'sign'),
    broadcast: (...params: Parameters<ChainWalletContext['broadcast']>) =>
      ma.assertWallet(wallet?.broadcast, params, 'broadcast'),
    signAndBroadcast: (
      ...params: Parameters<ChainWalletContext['signAndBroadcast']>
    ) => ma.assertWallet(wallet?.signAndBroadcast, params, 'signAndBroadcast'),

    qrUrl: wallet?.client?.qrUrl,
    appUrl: wallet?.client?.appUrl,

    enable: () =>
      ma.assertWalletClient(
        wallet?.client?.enable.bind(wallet.client),
        [chainId],
        'enable'
      ),
    getAccount: () =>
      ma.assertWalletClient(
        wallet?.client?.getAccount.bind(wallet.client),
        [chainId],
        'getAccount'
      ),
    getOfflineSigner: () =>
      ma.assertWalletClient(
        wallet?.client?.getOfflineSigner.bind(wallet.client),
        [chainId, wallet?.preferredSignType],
        'getOfflineSigner'
      ),
    getOfflineSignerAmino: () =>
      ma.assertWalletClient(
        wallet?.client?.getOfflineSignerAmino.bind(wallet.client),
        [chainId],
        'getOfflineSignerAmino'
      ),
    getOfflineSignerDirect: () =>
      ma.assertWalletClient(
        wallet?.client?.getOfflineSignerDirect.bind(wallet.client),
        [chainId],
        'getOfflineSignerDirect'
      ),
    signAmino: (...params: Parameters<ChainWalletContext['signAmino']>) =>
      ma.assertWalletClient(
        wallet?.client?.signAmino.bind(wallet.client),
        [chainId, ...params],
        'signAmino'
      ),
    signDirect: (...params: Parameters<ChainWalletContext['signDirect']>) =>
      ma.assertWalletClient(
        wallet?.client?.signDirect.bind(wallet.client),
        [chainId, ...params],
        'signDirect'
      ),
    sendTx: (...params: Parameters<ChainWalletContext['sendTx']>) =>
      ma.assertWalletClient(
        wallet?.client?.sendTx.bind(wallet.client),
        [chainId, ...params],
        'sendTx'
      ),
  };
}
