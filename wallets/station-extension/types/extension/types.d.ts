export declare type ChainId = string;
export declare type Addresses = Record<ChainId, string>;
export declare type CoinType = number;
export declare type Pubkeys = Record<CoinType, string>;
export interface NetworkInfo {
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
