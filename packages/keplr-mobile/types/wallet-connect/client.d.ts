/// <reference types="node" />
import { AminoSignResponse, OfflineAminoSigner, StdSignDoc } from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import { OS, SignOptions } from '@cosmos-kit/core';
import { IWCClientV1 } from '@cosmos-kit/walletconnect-v1';
import { KeplrIntereactionOptions } from '@keplr-wallet/types';
import { IConnector } from '@walletconnect/types-v1';
export declare class KeplrClient implements IWCClientV1 {
    defaultOptions: KeplrIntereactionOptions;
    readonly connector: IConnector;
    constructor();
    get qrUrl(): string;
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
