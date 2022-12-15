import { AminoSignResponse, OfflineAminoSigner, StdSignDoc } from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import { OS, WalletConnectClient } from '@cosmos-kit/core';
import { IConnector } from '@walletconnect/types-v1';
export declare class CosmostationClient implements WalletConnectClient {
    readonly connector: IConnector;
    constructor();
    get qrUrl(): any;
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
