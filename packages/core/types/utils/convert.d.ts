import { AssetList, Chain } from '@chain-registry/types';
import { ChainRecord, Endpoints, SignerOptions } from '../types';
export declare function convertChain(chain: Chain, assetLists: AssetList[], signerOptions?: SignerOptions, preferredEndpoints?: Endpoints): ChainRecord;
