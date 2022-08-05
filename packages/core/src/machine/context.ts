import {
  ChainInfoID,
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
  connectedWallets: {
    default: undefined,
  } as Partial<
    Record<
      typeof ChainInfoID[keyof typeof ChainInfoID] | 'default',
      Maybe<ConnectedWallet>
    >
  >,

  wallet: undefined as Maybe<Wallet>,
  walletClient: undefined as Maybe<WalletClient>,
  /* wallet type & wallet instance? probably should only have one */
  walletType: undefined as Maybe<WalletType>,
  walletConnect: undefined as Maybe<WalletConnect>,
  walletConnectUri: undefined as Maybe<string>,
  walletConnectAppDeepLink: undefined as Maybe<string>,
  walletConnectInstallationUri: undefined as Maybe<string>,
  isEmbeddedKeplrMobileWeb: false,
  /* enabled wallets and then enabled wallet types that we pass from props? */
  enabledWallets: undefined as Maybe<Array<Wallet>>,
  cleanUpWalletConnectCallback: undefined as Maybe<(...args: any) => any>,
  defaultChainId: undefined as Maybe<ChainInfo['chainId']>,
  chainInfoOverrides: undefined as Maybe<ChainInfoOverrides>,
  localStorageKey: undefined as Maybe<string>,
  // Descriptive info about the webapp which gets displayed when enabling a
  // WalletConnect wallet (e.g. name, image, etc.).
  walletConnectClientMeta: undefined as Maybe<IClientMeta>,
  onKeplrKeystoreChangeEvent: undefined as Maybe<(event: Event) => unknown>,
  preselectedWalletType: undefined as Maybe<WalletType>,

  // Getter for options passed to SigningCosmWasmClient on connection.
  getSigningCosmWasmClientOptions: undefined as Maybe<
    SigningClientGetter<SigningCosmWasmClientOptions>
  >,
  // Getter for options passed to SigningStargateClient on connection.
  getSigningStargateClientOptions: undefined as Maybe<
    SigningClientGetter<SigningStargateClientOptions>
  >,
  error: {
    instance: undefined as Maybe<Error>,
    message: undefined as Maybe<string>,
  },
}
