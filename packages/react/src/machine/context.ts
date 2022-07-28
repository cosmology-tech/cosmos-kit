import {
  ChainInfoOverrides,
  ConnectedWallet,
  Maybe,
  SigningClientGetter,
  Wallet,
  WalletClient,
  WalletType,
} from '../types'
import WalletConnect from '@walletconnect/client'
import { ChainInfo } from '@keplr-wallet/types'
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate'
import { SigningStargateClientOptions } from '@cosmjs/stargate'
import { IClientMeta } from '@walletconnect/types'

export const walletMachineInitialContext = {
  connectedWallet: undefined as Maybe<ConnectedWallet>,
  wallet: undefined as Maybe<Wallet>,
  walletClient: undefined as Maybe<WalletClient>,
  walletType: undefined as Maybe<WalletType>,
  walletConnect: undefined as Maybe<WalletConnect>,
  walletConnectUri: undefined as Maybe<string>,
  walletConnectAppDeepLink: undefined as Maybe<string>,
  walletConnectInstallationUri: undefined as Maybe<string>,
  isEmbeddedKeplrMobileWeb: false,
  enabledWallets: undefined as Maybe<Array<Wallet>>,
  cleanUpWalletConnectCallback: undefined as Maybe<(...args: any) => any>,

  config: {
    defaultChainId: undefined as Maybe<ChainInfo['chainId']>,
    chainInfoOverrides: undefined as Maybe<ChainInfoOverrides>,
    localStorageKey: undefined as Maybe<string>,
    // Descriptive info about the webapp which gets displayed when enabling a
    // WalletConnect wallet (e.g. name, image, etc.).
    walletConnectClientMeta: undefined as Maybe<IClientMeta>,
    onKeplrKeystoreChangeEvent: undefined as Maybe<(event: Event) => unknown>,
    preselectedWalletType: undefined as Maybe<WalletType>,
  },

  utils: {
    // Getter for options passed to SigningCosmWasmClient on connection.
    getSigningCosmWasmClientOptions: undefined as Maybe<
      SigningClientGetter<SigningCosmWasmClientOptions>
    >,
    // Getter for options passed to SigningStargateClient on connection.
    getSigningStargateClientOptions: undefined as Maybe<
      SigningClientGetter<SigningStargateClientOptions>
    >,
  },

  error: {
    instance: undefined as Maybe<Error>,
    message: undefined as Maybe<string>,
  },
}
