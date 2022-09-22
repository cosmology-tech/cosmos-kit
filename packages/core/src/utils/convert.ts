import { Chain } from '@chain-registry/types';
import { ChainRecord, SignerOptions } from '@cosmos-kit/core';

export function convertChain(chain: Chain, signerOptions?: SignerOptions): ChainRecord {
    return {
        name: chain.chain_name,
        active: false,
        chain,
        signerOptions: {
            stargate: signerOptions?.stargate?.(chain),
            cosmwasm: signerOptions?.cosmwasm?.(chain)
        }
    };
}