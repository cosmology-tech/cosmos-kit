import { AminoSignResponse, OfflineAminoSigner, StdSignDoc } from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import { OS, WalletConnectClient } from '@cosmos-kit/core';
import { IConnector } from '@walletconnect/types';
export declare class CosmostationClient implements WalletConnectClient {
    readonly connector: IConnector;
    constructor();
    get qrUrl(): string;
    getAppUrl(os: OS): string;
    enable(chainIds: string | string[]): Promise<void>;
    getAccount(chainId: string): Promise<{
        name: string;
        address: string;
        algo: Algo;
        pubkey: Uint8Array;
    }>;
    getOfflineSigner(chainId: string): OfflineAminoSigner;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc): Promise<AminoSignResponse>;
}
