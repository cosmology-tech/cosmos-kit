import { StdSignDoc, OfflineAminoSigner } from '@cosmjs/amino';
import { Algo, DirectSignResponse } from '@cosmjs/proto-signing';
import { SignType } from '@cosmos-kit/core';
import { SignOptions, WalletClient } from '@cosmos-kit/core';
import { cosmjsOfflineSigner } from './cosmjs-offline-signer';
import { SignDoc } from '@keplr-wallet/types';
export declare class CosmosSnapClient implements WalletClient {
    readonly snapInstalled: boolean;
    constructor();
    getSimpleAccount(chainId: string): Promise<{
        namespace: string;
        chainId: string;
        address: string;
        username: string;
    }>;
    handleConnect(): Promise<void>;
    getAccount(chainId: string): Promise<{
        username: string;
        address: string;
        algo: Algo;
        pubkey: Uint8Array;
    }>;
    getOfflineSigner(chainId: string, preferredSignType?: SignType): OfflineAminoSigner;
    getOfflineSignerAmino(chainId: string): OfflineAminoSigner;
    getOfflineSignerDirect(chainId: string): cosmjsOfflineSigner;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<import("@cosmjs/amino").AminoSignResponse>;
    signDirect(chainId: string, signer: string, signDoc: SignDoc): Promise<DirectSignResponse>;
}
