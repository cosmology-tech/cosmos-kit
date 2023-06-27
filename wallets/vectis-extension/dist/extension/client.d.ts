import * as _cosmjs_proto_signing from '@cosmjs/proto-signing';
import * as _cosmjs_amino from '@cosmjs/amino';
import { Algo, StdSignDoc, StdSignature } from '@cosmjs/amino';
import { WalletClient, SignType, ChainRecord, SignOptions, DirectSignDoc, BroadcastMode } from '@cosmos-kit/core';
import { Vectis } from './types.js';
import '@keplr-wallet/types';

declare class VectisClient implements WalletClient {
    readonly client: Vectis;
    constructor(client: Vectis);
    enable(chainIds: string | string[]): Promise<void>;
    getSimpleAccount(chainId: string): Promise<{
        namespace: string;
        chainId: string;
        address: string;
        username: string;
    }>;
    getAccount(chainId: string): Promise<{
        username: string;
        address: string;
        algo: Algo;
        pubkey: Uint8Array;
        isNanoLedger: boolean;
        isSmartContract: boolean;
    }>;
    getOfflineSigner(chainId: string, preferredSignType?: SignType): Promise<_cosmjs_amino.OfflineAminoSigner | _cosmjs_proto_signing.OfflineDirectSigner>;
    getOfflineSignerAmino(chainId: string): _cosmjs_amino.OfflineAminoSigner;
    getOfflineSignerDirect(chainId: string): _cosmjs_proto_signing.OfflineDirectSigner;
    addChain({ chain, name, assetList, preferredEndpoints }: ChainRecord): Promise<void>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<_cosmjs_amino.AminoSignResponse>;
    signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions): Promise<_cosmjs_proto_signing.DirectSignResponse>;
    signArbitrary(chainId: string, signer: string, data: string | Uint8Array): Promise<StdSignature>;
    sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
}

export { VectisClient };
