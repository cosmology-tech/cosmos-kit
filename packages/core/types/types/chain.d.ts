import { AssetList, Chain } from '@chain-registry/types';
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClientOptions, StargateClientOptions } from '@cosmjs/stargate';
import { Endpoints } from './manager';
export declare type ChainName = string;
export interface ChainRecord {
    name: ChainName;
    chain: Chain;
    assetList?: AssetList;
    clientOptions?: {
        signingStargate?: SigningStargateClientOptions;
        signingCosmwasm?: SigningCosmWasmClientOptions;
        stargate?: StargateClientOptions;
    };
    preferredEndpoints?: Endpoints;
}
