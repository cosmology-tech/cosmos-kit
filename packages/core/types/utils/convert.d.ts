import { AssetList, Chain } from '@chain-registry/types';
import { ChainRecord, Endpoints, SignerOptions } from '../types';
import { Logger } from './logger';
export declare function convertChain(chain: Chain, assetLists: AssetList[], signerOptions?: SignerOptions, preferredEndpoints?: Endpoints, isLazy?: boolean, logger?: Logger): ChainRecord;
