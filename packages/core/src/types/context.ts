import { AssetList, Chain } from '@chain-registry/types';
import { ChainWalletBase } from '../bases';
import { WalletRepo } from '../repository';
import { ChainName, ChainRecord } from './chain';
import { ModalTheme, Mutable, State } from './common';
import {
  EndpointOptions,
  EventName,
  ExtendedHttpEndpoint,
  SignerOptions,
} from './manager';
import {
  AppUrl,
  EncodedString,
  SimpleAccount,
  Wallet,
  WalletAccount,
  WalletClient,
  WalletStatus,
} from './wallet';

export interface ChainWalletContext {
  chainWallet: ChainWalletBase | undefined;

  chain: Chain;
  assets: AssetList | undefined;
  wallet: Wallet;
  logoUrl: string | undefined;
  address: string | undefined;
  username: string | undefined;
  message: string | undefined;
  status: WalletStatus;

  isWalletDisconnected: boolean;
  isWalletConnecting: boolean;
  isWalletConnected: boolean;
  isWalletRejected: boolean;
  isWalletNotExist: boolean;
  isWalletError: boolean;

  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  getRpcEndpoint: (isLazy?: boolean) => Promise<string | ExtendedHttpEndpoint>;
  getRestEndpoint: (isLazy?: boolean) => Promise<string | ExtendedHttpEndpoint>;

  // from wallet client
  qrUrl: Mutable<string> | undefined;
  appUrl: Mutable<AppUrl> | undefined;

  getSimpleAccount: () => Promise<SimpleAccount>;
  getAccount: () => Promise<WalletAccount>;
  sign<T>(doc: T): Promise<EncodedString>;
  broadcast?<T>(signedDoc: T): Promise<EncodedString>;
}

export interface ChainContext extends ChainWalletContext {
  wallet: Wallet | undefined;
  walletRepo: WalletRepo;
  openView: () => void;
  closeView: () => void;
}

export interface ManagerContext {
  chainRecords: ChainRecord[];
  walletRepos: WalletRepo[];
  defaultNameService: NameServiceName;
  getChainRecord: (chainName: ChainName) => ChainRecord;
  getWalletRepo: (chainName: ChainName) => WalletRepo;
  addChains: (
    chains: Chain[],
    assetLists: AssetList[],
    signerOptions?: SignerOptions,
    endpointOptions?: EndpointOptions
  ) => void;
  getChainLogo: (chainName: ChainName) => string | undefined;
  getNameService: (chainName?: ChainName) => Promise<NameService>;
  on: (event: EventName, handler: (params: any) => void) => void;
  off: (event: EventName, handler: (params: any) => void) => void;
}

export interface ModalThemeContext {
  modalTheme: ModalTheme;
  setModalTheme: (theme: ModalTheme) => void;
}

export interface WalletContext {
  chainWallets: ChainWalletBase[];
  wallet: Wallet | undefined;
  status: WalletStatus;
  message: string | undefined;
}

export interface WalletClientContext {
  client: WalletClient | undefined;
  status: State;
  message: string | undefined;
}
