import { AssetList, Chain } from '@chain-registry/types';
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClientOptions } from '@cosmjs/stargate';

import { Endpoints } from './manager';

export type ChainName = string;

export interface ChainRecord {
  name: ChainName;
  chain: Chain;
  assetList: AssetList;
  signerOptions?: {
    stargate?: SigningStargateClientOptions;
    cosmwasm?: SigningCosmWasmClientOptions;
  };
  preferredEndpoints?: Endpoints;
}
