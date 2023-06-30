import { BroadcastMode, DirectSignDoc, WalletClient } from '@cosmos-kit/core';
import type { AccountData, DirectSignResponse, ExodusCosmosProvider, StdSignDoc } from '../types';
export declare class ExodusClient implements WalletClient {
    readonly client: ExodusCosmosProvider;
    constructor(client: ExodusCosmosProvider);
    connect(chainId: string | string[]): Promise<void>;
    getSimpleAccount(chainId: string): Promise<{
        namespace: string;
        chainId: string;
        address: string;
    }>;
    getAccount(chainId: string): Promise<{
        pubkey: Uint8Array;
        address: string;
        algo: import("@cosmjs/proto-signing").Algo;
        publicKey: Uint8Array;
    }>;
    getOfflineSigner(chainId: string): Promise<{
        getAccounts: () => Promise<AccountData[]>;
        signDirect: (signer: string, signDoc: DirectSignDoc) => Promise<DirectSignResponse>;
    }>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc): Promise<import("@cosmjs/amino").AminoSignResponse>;
    sendTx(chainId: string, transaction: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
}
