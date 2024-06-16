export const KEYSTORE = 'keystore' as const;
export const ACTIVE_WALLET = 'active-wallet' as const;

export type TKey = typeof KEYSTORE | typeof ACTIVE_WALLET;

export type TWallet = {
  addressIndex: number;
  name: string;
  cipher: string; // mnemonic, should be encrypted in real environment.
  addresses: Record<string, string>;
  pubKeys: Record<string, Uint8Array>;
  walletType: string;
  id: string;
};

export type TValueMap = {
  [KEYSTORE]: { [walletId: string]: TWallet };
  [ACTIVE_WALLET]: TWallet;
};

export type TKeyChainMap = {
  [K in TKey]: TValueMap[K];
};

export class KeyChainClass {
  private storage = new Map<TKey, any>();

  setItem<K extends TKey>(key: K, value: TKeyChainMap[K]): void {
    this.storage.set(key, value);
  }

  getItem<K extends TKey>(key: K): TKeyChainMap[K] | undefined {
    return this.storage.get(key);
  }
}

export const KeyChain = new KeyChainClass();
