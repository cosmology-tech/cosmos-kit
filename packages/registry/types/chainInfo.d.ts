import { ChainInfoOverrides } from '@cosmos-wallet/types';
import { AppCurrency, ChainInfo } from '@keplr-wallet/types';
/** All currency attributes (stake and fee) are defined once in the `currencies` list.
 *  Maintains the option to skip this conversion and keep the verbose `ChainInfo` type.
 */
export declare type SimplifiedChainInfo = Omit<ChainInfo, 'stakeCurrency' | 'feeCurrencies'> & {
    currencies: Array<AppCurrency & {
        isStakeCurrency?: boolean;
        isFeeCurrency?: boolean;
    }>;
};
/** Convert a less redundant chain info schema into one that is accepted by Keplr's suggestChain: `ChainInfo`. */
export declare function createKeplrChainInfo({ currencies: _currencies, ...chainInfo }: SimplifiedChainInfo): ChainInfo;
export declare const ChainInfoMap: Record<"bostrom" | "osmosis-1" | "cosmoshub-4" | "columbus-5" | "secret-4" | "akashnet-2" | "regen-1" | "sentinelhub-2" | "core-1" | "irishub-1" | "crypto-org-chain-mainnet-1" | "iov-mainnet-ibc" | "emoney-3" | "juno-1" | "uni-3" | "microtick-1" | "likecoin-mainnet-2" | "impacthub-3" | "bitcanna-1" | "bitsong-2b" | "kichain-2" | "panacea-3" | "comdex-1" | "cheqd-mainnet-1" | "stargaze-1" | "chihuahua-1" | "lum-network-1" | "vidulum-1" | "desmos-mainnet" | "dig-1" | "sommelier-3" | "sifchain-1" | "laozi-mainnet" | "darchub" | "umee-1" | "gravity-bridge-3" | "mainnet-3" | "shentu-2.2" | "carbon-1" | "injective-1" | "cerberus-chain-1" | "fetchhub-4" | "mantle-1" | "pio-mainnet-1" | "galaxy-1" | "meme-1" | "evmos_9001-2" | "phoenix-1" | "titan-1" | "kava_2222-10" | "genesis_29-2", ChainInfo>;
export declare const getChainInfo: (chainId: ChainInfo['chainId'], chainInfoOverrides?: ChainInfoOverrides) => Promise<ChainInfo>;
