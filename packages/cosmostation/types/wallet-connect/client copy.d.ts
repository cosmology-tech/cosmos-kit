/// <reference types="node" />
import { AminoSignResponse, OfflineAminoSigner, StdSignDoc } from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import { OS, SignOptions, WalletConnectClientBase } from '@cosmos-kit/core';
import { KeplrIntereactionOptions } from '@keplr-wallet/types';
import WalletConnect from '@walletconnect/client';
export declare class KeplrClient implements WalletConnectClientBase {
    readonly connector: WalletConnect;
    defaultOptions: KeplrIntereactionOptions;
    constructor();
    getAppUrl(os: OS): string;
    enable(chainIds: string | string[]): Promise<void>;
    getAccount(chainId: string): Promise<{
        name: any;
        address: any;
        algo: Algo;
        pubkey: Buffer;
    }>;
    getOfflineSigner(chainId: string): OfflineAminoSigner;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<AminoSignResponse>;
}
