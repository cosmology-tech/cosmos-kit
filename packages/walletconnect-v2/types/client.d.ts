/// <reference types="node" />
import { Algo, AminoSignResponse, OfflineAminoSigner, StdSignDoc } from '@cosmjs/amino';
import { DirectSignResponse, OfflineDirectSigner } from '@cosmjs/proto-signing';
import { DirectSignDoc, SignOptions, WalletClient } from '@cosmos-kit/core';
import SignClient from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';
export declare class WCClientV2 implements WalletClient {
    readonly signClient: SignClient;
    constructor(signClient: SignClient);
    get session(): SessionTypes.Struct;
    disconnect(): Promise<void>;
    getAccount(chainId: string): Promise<{
        address: string;
        algo: Algo;
        pubkey: Buffer;
        isNanoLedger: boolean;
    }>;
    getOfflineSignerAmino(chainId: string): OfflineAminoSigner;
    getOfflineSignerDirect(chainId: string): OfflineDirectSigner;
    getOfflineSigner(chainId: string): Promise<OfflineAminoSigner | OfflineDirectSigner>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<AminoSignResponse>;
    signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions): Promise<DirectSignResponse>;
}
