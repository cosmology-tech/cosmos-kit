import { Chain } from '@chain-registry/types';
import { ChainRecord, Endpoints, SignerOptions } from '../types';
export declare function convertChain(chain: Chain, signerOptions?: SignerOptions, preferredEndpoints?: Endpoints): ChainRecord;
