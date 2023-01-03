import { AminoSignResponse, OfflineAminoSigner, StdSignDoc } from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import { OS } from '@cosmos-kit/core';
import { IWCClientV1 } from '@cosmos-kit/walletconnect-v1';
import { IConnector } from '@walletconnect/types-v1';
export declare class CosmostationClient implements IWCClientV1 {
    readonly connector: IConnector;
    constructor();
    get qrUrl(): string;
    getAppUrl(os?: OS): string;
    getAccount(chainId: string): Promise<{
        name: string;
        address: string;
        algo: Algo;
        pubkey: Uint8Array;
        isNanoLedger: boolean;
    }>;
    getOfflineSignerAmino(chainId: string): OfflineAminoSigner;
    getOfflineSigner(chainId: string): Promise<OfflineAminoSigner>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc): Promise<AminoSignResponse>;
}
