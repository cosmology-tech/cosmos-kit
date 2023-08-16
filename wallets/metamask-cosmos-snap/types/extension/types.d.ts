/// <reference types="long" />
import { AminoSignResponse, OfflineAminoSigner, StdSignDoc } from '@cosmjs/amino';
import { OfflineDirectSigner, OfflineSigner } from '@cosmjs/proto-signing';
import { DirectSignResponse } from '@cosmjs/proto-signing';
export interface Key {
    name: string;
    algo: string;
    pubKey: Uint8Array;
    address: Uint8Array;
    bech32Address: string;
    isNanoLedger: boolean;
}
export declare type GetSnapsResponse = Record<string, Snap>;
export declare type Snap = {
    permissionName: string;
    id: string;
    version: string;
    initialPermissions: Record<string, unknown>;
};
export interface LeapSignOptions {
    readonly preferNoSetFee?: boolean;
    readonly preferNoSetMemo?: boolean;
    readonly disableBalanceCheck?: boolean;
}
export interface MetamaskCosmosSnap {
    disconnect(): Promise<void>;
    enable(chainIds: string | string[]): Promise<void>;
    mode: 'extension';
    getKey(chainId: string): Promise<Key>;
    getOfflineSigner(chainId: string): OfflineAminoSigner & OfflineDirectSigner;
    getOfflineSignerOnlyAmino(chainId: string): OfflineAminoSigner;
    getOfflineSignerAuto(chainId: string): Promise<OfflineSigner>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc): Promise<AminoSignResponse>;
    signDirect(chainId: string, signer: string, signDoc: {
        /** SignDoc bodyBytes */
        bodyBytes?: Uint8Array | null;
        /** SignDoc authInfoBytes */
        authInfoBytes?: Uint8Array | null;
        /** SignDoc chainId */
        chainId?: string | null;
        /** SignDoc accountNumber */
        accountNumber?: Long | null;
    }): Promise<DirectSignResponse>;
}
