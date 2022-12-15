/// <reference types="node" />
import { AminoSignResponse, OfflineAminoSigner, StdSignDoc } from '@cosmjs/amino';
import { DirectSignResponse, OfflineDirectSigner } from '@cosmjs/proto-signing';
import SignClient from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';
import { DirectSignDoc, SignOptions, WalletClient } from '../types';
export declare class WCClientV2 implements WalletClient {
    readonly signClient: SignClient;
    constructor(signClient: SignClient);
    get session(): SessionTypes.Struct;
    getAccount(chainId: string): Promise<{
        address: string;
        algo: import("@cosmjs/amino").Algo;
        pubkey: Buffer;
        isNanoLedger: boolean;
    }>;
    getOfflineSignerAmino(chainId: string): OfflineAminoSigner;
    getOfflineSignerDirect(chainId: string): OfflineDirectSigner;
    getOfflineSigner(chainId: string): Promise<OfflineAminoSigner | OfflineDirectSigner>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<AminoSignResponse>;
    signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions): Promise<DirectSignResponse>;
}
