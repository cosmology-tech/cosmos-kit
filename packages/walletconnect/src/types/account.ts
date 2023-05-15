export interface CosmosAccount {
  address: string;
  algo: string;
  pubkey: string;
}

export type TezosAccount = CosmosAccount;

export interface SolanaAccount {
  pubkey: string;
}

export interface NearAccount {
  accountId: string;
  pubkey: string;
}
