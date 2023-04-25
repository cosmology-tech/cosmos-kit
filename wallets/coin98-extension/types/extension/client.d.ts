import { StdSignDoc } from '@cosmjs/amino';
import { Algo, OfflineDirectSigner } from '@cosmjs/proto-signing';
import { BroadcastMode, ChainRecord, DirectSignDoc, SignOptions, SignType, WalletClient } from '@cosmos-kit/core';
import { Coin98 } from './types';
export declare class Coin98Client implements WalletClient {
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
    getOfflineSigner(chainId: string, preferredSignType?: SignType): OfflineDirectSigner | import("@keplr-wallet/types").OfflineAminoSigner;
    getOfflineSignerAmino(chainId: string): import("@keplr-wallet/types").OfflineAminoSigner;
    getOfflineSignerDirect(chainId: string): OfflineDirectSigner;
    addChain(chainInfo: ChainRecord): Promise<void>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<import("@keplr-wallet/types").AminoSignResponse>;
    signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions): Promise<import("@keplr-wallet/types").DirectSignResponse>;
    sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
}
