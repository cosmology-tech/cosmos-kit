import { AssetList, Chain } from '@chain-registry/types';
import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignDoc,
} from '@cosmjs/amino';
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate';
import {
  DirectSignResponse,
  EncodeObject,
  OfflineDirectSigner,
  OfflineSigner,
} from '@cosmjs/proto-signing';
import {
  DeliverTxResponse,
  SigningStargateClient,
  StargateClient,
  StdFee,
} from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { ChainWalletBase } from '../bases';
import { NameService } from '../name-service';
import { WalletRepo } from '../repository';
import { ChainName, ChainRecord } from './chain';
import { CosmosClientType, State } from './common';
import { EndpointOptions, SignerOptions } from './manager';
import {
  BroadcastMode,
  DirectSignDoc,
  NameServiceName,
  SignOptions,
  Wallet,
  WalletClient,
  WalletName,
  WalletStatus,
} from './wallet';

export interface ChainContext {
  walletRepo: WalletRepo;
  chainWallet: ChainWalletBase | undefined;
  client: WalletClient | undefined;
  clientStatus: State;
  clientMessage: string | undefined;

  chain: Chain;
  assets: AssetList | undefined;
  wallet: Wallet | undefined;
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

  openView: () => void;
  closeView: () => void;
  connect: (wallet?: WalletName) => Promise<void>;
  disconnect: () => Promise<void>;
  getRpcEndpoint: () => Promise<string>;
  getRestEndpoint: () => Promise<string>;
  getStargateClient: () => Promise<StargateClient>;
  getCosmWasmClient: () => Promise<CosmWasmClient>;
  getSigningStargateClient: () => Promise<SigningStargateClient>;
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>;
  getNameService: () => Promise<NameService>;

  estimateFee: (
    messages: EncodeObject[],
    type?: CosmosClientType,
    memo?: string,
    multiplier?: number
  ) => Promise<StdFee>;
  sign: (
    messages: EncodeObject[],
    fee?: StdFee,
    memo?: string,
    type?: CosmosClientType
  ) => Promise<TxRaw>;
  broadcast: (
    signedMessages: TxRaw,
    type?: CosmosClientType
  ) => Promise<DeliverTxResponse>;
  signAndBroadcast: (
    messages: EncodeObject[],
    fee?: StdFee,
    memo?: string,
    type?: CosmosClientType
  ) => Promise<DeliverTxResponse>;

  // methods exposed from wallet client
  enable: (chainIds: string | string[]) => Promise<void>;
  getOfflineSigner: (chainId: string) => Promise<OfflineSigner>;
  getOfflineSignerAmino: (chainId: string) => OfflineAminoSigner;
  getOfflineSignerDirect: (chainId: string) => OfflineDirectSigner;
  signAmino: (
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ) => Promise<AminoSignResponse>;
  signDirect: (
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ) => Promise<DirectSignResponse>;
  sendTx(tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
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
}

export type ModalTheme = 'light' | 'dark';

export interface ModalThemeContext {
  modalTheme: ModalTheme;
  setModalTheme: (theme: ModalTheme) => void;
}
