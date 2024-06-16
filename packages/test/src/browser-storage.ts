import { Chain } from '@chain-registry/types';

export const CONNECTIONS = 'connections' as const;
export const BETA_CW20_TOKENS = 'beta-cw20-tokens' as const;

export type TKey = typeof CONNECTIONS | typeof BETA_CW20_TOKENS;

export type TConnectionsValue = {
  [walletId: string]: {
    [chainId: string]: string[];
  };
};

export type TCW20Token = {
  coinDenom: string;
  coinMinimalDenom: string;
  coinDecimals: number;
  chain: Chain;
  coinGeckoId: string;
  icon: string;
};

export type TBetaCW20TokenValue = {
  [chainId: string]: {
    [contractAddress: string]: TCW20Token;
  };
};

export type TValueMap = {
  [CONNECTIONS]: TConnectionsValue;
  [BETA_CW20_TOKENS]: TBetaCW20TokenValue;
};

export type TBrowserStorageMap = {
  [K in TKey]: TValueMap[K];
};

export class BrowserStorageClass {
  private storage = new Map<TKey, any>();

  setItem<K extends TKey>(key: K, value: TBrowserStorageMap[K]): void {
    this.storage.set(key, value);
  }

  getItem<K extends TKey>(key: K): TBrowserStorageMap[K] | undefined {
    return this.storage.get(key);
  }
}

export const BrowserStorage = new BrowserStorageClass();
