import { WalletName } from '@cosmos-kit/core';
import { walletInfos } from './wallet';
import { Chain } from '@chain-registry/types';
import { ChainInfo } from '@cosmos-kit/core';

export function convertChain(chain: Chain): ChainInfo {
    return {
        name: chain.chain_name,
        active: false,
        registry: chain,
        options: {
            stargate: (chain) => undefined,
            cosmwasm: (chain) => undefined,
        }
    };
}

export function getWalletPrettyName(name?: WalletName) {
    if (!name) {
        return undefined;
    }
    return walletInfos.find(v => v.name === name)?.prettyName;
}