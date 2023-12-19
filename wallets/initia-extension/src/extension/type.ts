import type { OfflineDirectSigner } from '@cosmjs/proto-signing';
import type { DeliverTxResponse } from '@cosmjs/stargate';
import type {
  CosmosChain,
  EthereumChain,
  InitiaChain,
  LayerInfo,
} from '@initia/shared';

export interface InitiaWallet {
  getAddress: (chainKey: string) => Promise<string>;
  signAndBroadcast: (
    chainKey: string,
    txBody: Uint8Array,
    layerKey?: string | null
  ) => Promise<DeliverTxResponse>;
  getOfflineSigner: (
    chainKey: string,
    layerKey?: string | null
  ) => OfflineDirectSigner;
  requestAddInitiaLayer: (chain: Partial<LayerInfo>) => Promise<void>;
  requestAddInitiaChain: (chain: Partial<InitiaChain>) => Promise<void>;
  requestAddCosmosChain: (chain: CosmosChain) => Promise<void>;
  requestAddEthereumChain: (chain: EthereumChain) => Promise<void>;
}
