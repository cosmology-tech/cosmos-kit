import { Chain } from '@chain-registry/types';
import { ChainRecord, Endpoints, SignerOptions } from '@cosmos-kit/core';
export declare function convertChain(chain: Chain, signerOptions?: SignerOptions, preferredEndpoints?: Endpoints): ChainRecord;
