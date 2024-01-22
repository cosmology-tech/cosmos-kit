import { AssetList, Chain } from '@chain-registry/types';
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import {
  SigningStargateClientOptions,
  StargateClientOptions,
} from '@cosmjs/stargate';

import { SignType } from './common';
import { Endpoints } from './manager';

export type ChainName = string;

export interface ChainRecord {
  name: ChainName;
  chain?: Chain;
  assetList?: AssetList;
  clientOptions?: {
    signingStargate?: SigningStargateClientOptions;
    signingCosmwasm?: SigningCosmWasmClientOptions;
    stargate?: StargateClientOptions;
    preferredSignType?: SignType;
  };
  preferredEndpoints?: Endpoints;
}
