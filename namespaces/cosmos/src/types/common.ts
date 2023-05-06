import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import {
  SigningStargateClientOptions,
  StargateClientOptions,
} from '@cosmjs/stargate';

export type NameServiceName = string;

export type CosmosClientType = 'stargate' | 'cosmwasm';
export type CosmosSignType = 'amino' | 'direct';

export declare enum BroadcastMode {
  /** Return after tx commit */
  Block = 'block',
  /** Return after CheckTx */
  Sync = 'sync',
  /** Return right away */
  Async = 'async',
}

export interface CosmosClientOptions {
  signingStargate?: SigningStargateClientOptions;
  signingCosmwasm?: SigningCosmWasmClientOptions;
  stargate?: StargateClientOptions;
  preferredSignType?: CosmosSignType;
}
