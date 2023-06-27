import * as _keplr_wallet_types from '@keplr-wallet/types';
import { StdSignDoc, StdSignature } from '@cosmjs/amino';
import { Algo, OfflineDirectSigner } from '@cosmjs/proto-signing';
import { WalletClient, SignType, ChainRecord, SignOptions, DirectSignDoc, BroadcastMode } from '@cosmos-kit/core';
import { Coin98 } from './types.js';

declare class Coin98Client implements WalletClient {
    readonly client: Coin98;
    constructor(client: Coin98);
    enable(chainIds: string | string[]): Promise<void>;
    connect(chainIds: string | string[]): Promise<void>;
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
    }>;
    getOfflineSigner(chainId: string, preferredSignType?: SignType): OfflineDirectSigner | _keplr_wallet_types.OfflineAminoSigner;
    getOfflineSignerAmino(chainId: string): _keplr_wallet_types.OfflineAminoSigner;
    getOfflineSignerDirect(chainId: string): OfflineDirectSigner;
    addChain(chainInfo: ChainRecord): Promise<void>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<_keplr_wallet_types.AminoSignResponse>;
    signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions): Promise<_keplr_wallet_types.DirectSignResponse>;
    signArbitrary(chainId: string, signer: string, data: string | Uint8Array): Promise<StdSignature>;
    sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
}

export { Coin98Client };
