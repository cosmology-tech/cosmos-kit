import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdFee,
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
} from '@cosmjs/stargate';
import {
  ChainWalletContext,
  SignOptions,
  Wallet,
  WalletRepo,
} from '@cosmos-kit/core';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { BroadcastMode, CosmosClientType, DirectSignDoc } from './common';

export interface CosmosChainWalletContext extends ChainWalletContext {
  getStargateClient: () => Promise<StargateClient>;
  getCosmWasmClient: () => Promise<CosmWasmClient>;
  getSigningStargateClient: () => Promise<SigningStargateClient>;
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>;

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

  getOfflineSigner: () => OfflineSigner;
  getOfflineSignerAmino: () => OfflineAminoSigner;
  getOfflineSignerDirect: () => OfflineDirectSigner;
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

export interface CosmosChainContext extends CosmosChainWalletContext {
  wallet: Wallet | undefined;
  walletRepo: WalletRepo;
  openView: () => void;
  closeView: () => void;
}
