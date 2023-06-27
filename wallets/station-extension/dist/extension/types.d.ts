declare type ChainId = string;
declare type Addresses = Record<ChainId, string>;
declare type CoinType = number;
declare type Pubkeys = Record<CoinType, string>;
interface NetworkInfo {
    baseAsset: string;
    chainID: string;
    coinType: string;
    gasAdjustment: number;
    gasPrices: Record<string, number>;
    icon: string;
    lcd: string;
    name: string;
    prefix: string;
}

export { Addresses, ChainId, CoinType, NetworkInfo, Pubkeys };
