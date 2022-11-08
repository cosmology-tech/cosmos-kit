/// <reference types="node" />
import { AminoSignResponse, OfflineAminoSigner, StdSignDoc } from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import { OS, SignOptions, WalletConnectClient } from '@cosmos-kit/core';
import { KeplrIntereactionOptions } from '@keplr-wallet/types';
import { IConnector } from '@walletconnect/types';
export declare class KeplrClient implements WalletConnectClient {
    readonly connector: IConnector;
    defaultOptions: KeplrIntereactionOptions;
    constructor();
    get qrUrl(): string;
    getAppUrl(os: OS): string;
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
