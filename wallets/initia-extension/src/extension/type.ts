import type { OfflineDirectSigner } from '@cosmjs/proto-signing';
import type { DeliverTxResponse } from '@cosmjs/stargate';
import type { Chain } from '@initia/initia-registry-types';

export interface InitiaWallet {
  version: string;
  getAddress: (chainId: string) => Promise<string>;
  signAndBroadcast: (
    chainId: string,
    txBody: Uint8Array
  ) => Promise<DeliverTxResponse>;
  getOfflineSigner: (chainId: string) => OfflineDirectSigner;
  requestAddInitiaLayer: (chain: Partial<Chain>) => Promise<void>;
  signArbitrary: (data: string | Uint8Array) => Promise<string>;
  verifyArbitrary: (
    data: string | Uint8Array,
    signature: string
  ) => Promise<boolean>;
}
