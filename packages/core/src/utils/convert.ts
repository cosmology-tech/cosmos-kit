import { Chain } from '@chain-registry/types';
import { ChainRecord, Endpoints, SignerOptions } from '../types';

export function convertChain(chain: Chain, signerOptions?: SignerOptions, preferredEndpoints?: Endpoints): ChainRecord {
    return {
        name: chain.chain_name,
        chain,
        signerOptions: {
            stargate: signerOptions?.stargate?.(chain),
            cosmwasm: signerOptions?.cosmwasm?.(chain)
        },
        preferredEndpoints
    };
}