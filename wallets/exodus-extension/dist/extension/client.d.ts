import * as _cosmjs_amino from '@cosmjs/amino';
import { StdSignDoc } from '@cosmjs/amino';
import * as _cosmjs_proto_signing from '@cosmjs/proto-signing';
import { AccountData, DirectSignResponse } from '@cosmjs/proto-signing';
import { WalletClient, DirectSignDoc, BroadcastMode } from '@cosmos-kit/core';
import { ExodusCosmosProvider } from '../types.js';

declare class ExodusClient implements WalletClient {
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
        algo: _cosmjs_proto_signing.Algo;
        publicKey: Uint8Array;
    }>;
    getOfflineSigner(chainId: string): Promise<{
        getAccounts: () => Promise<AccountData[]>;
        signDirect: (signer: string, signDoc: DirectSignDoc) => Promise<DirectSignResponse>;
    }>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc): Promise<_cosmjs_amino.AminoSignResponse>;
    sendTx(chainId: string, transaction: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
}

export { ExodusClient };
