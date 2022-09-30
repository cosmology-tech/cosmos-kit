import { AssetList, Chain } from '@chain-registry/types';
import { ChainInfo, Endpoints, SignerOptions } from '../types';
export declare function convertChain(chain: Chain, assetLists: AssetList[], signerOptions?: SignerOptions, preferredEndpoints?: Endpoints): ChainInfo;
