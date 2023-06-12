import type { AminoSignResponse, StdSignDoc } from '@cosmjs/amino';
import type { AccountData, DirectSignResponse } from '@cosmjs/proto-signing';
import type { BroadcastMode, DirectSignDoc } from '@cosmos-kit/core';

type Chain = string;

interface ConnectionOptions {
  chainId: Chain;
}

type Account = AccountData & { publicKey: Uint8Array };

export interface ExodusCosmosProvider {
  connect: (options: ConnectionOptions) => Promise<Account>;
  signTransaction: (transaction: DirectSignDoc) => Promise<DirectSignResponse>;
  signAminoTransaction: (
    aminoTransaction: StdSignDoc
  ) => Promise<AminoSignResponse>;
  sendTx: (
    chainId: string,
    rawTx: Uint8Array,
    mode: BroadcastMode
  ) => Promise<Uint8Array>;
}

export interface Exodus {
  cosmos: ExodusCosmosProvider;
}

export interface ExodusWindow {
  exodus: Exodus;
}

export type {
  AccountData,
  BroadcastMode,
  DirectSignDoc,
  DirectSignResponse,
  StdSignDoc,
};
