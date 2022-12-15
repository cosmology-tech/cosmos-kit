/// <reference types="node" />
import { AminoSignResponse, OfflineAminoSigner, StdSignDoc } from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import { OS, SignOptions, WalletConnectClient } from '@cosmos-kit/core';
import { KeplrIntereactionOptions } from '@keplr-wallet/types';
import { IConnector } from '@walletconnect/types-v1';
export declare class KeplrClient implements WalletConnectClient {
    defaultOptions: KeplrIntereactionOptions;
    readonly connector: IConnector;
    constructor();
    get qrUrl(): any;
    getAppUrl(os?: OS): string;
    enable(chainIds: string | string[]): Promise<void>;
    getAccount(chainId: string): Promise<{
        name: string;
        address: string;
        algo: Algo;
        pubkey: Buffer;
    }>;
    getOfflineSigner(chainId: string): OfflineAminoSigner;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<AminoSignResponse>;
}
