import * as _cosmjs_proto_signing from '@cosmjs/proto-signing';
import { OfflineDirectSigner, DirectSecp256k1Wallet, AccountData, DirectSignResponse } from '@cosmjs/proto-signing';
import { OfflineAminoSigner } from '@cosmjs/amino';
import { WalletClient } from '@cosmos-kit/core';
import { Web3Auth } from '@web3auth/modal';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

declare class Web3AuthCustomSigner implements OfflineDirectSigner {
    client: Web3AuthClient;
    chainId: string;
    constructor(client: Web3AuthClient, chainId: string);
    getSigner(chainId: string): Promise<DirectSecp256k1Wallet>;
    getAccounts(): Promise<readonly AccountData[]>;
    signDirect(signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse>;
}

declare class Web3AuthClient implements WalletClient {
    readonly client: Web3Auth;
    modalInitComplete: boolean;
    signers: Record<string, DirectSecp256k1Wallet | undefined>;
    constructor();
    getPrivateKey(): Promise<Uint8Array>;
    connect(_chainIds: string | string[]): Promise<void>;
    disconnect(): Promise<void>;
    getSimpleAccount(chainId: string): Promise<{
        namespace: string;
        chainId: string;
        address: string;
        username: string;
    }>;
    getAccount(chainId: string): Promise<{
        address: string;
        algo: _cosmjs_proto_signing.Algo;
        pubkey: Uint8Array;
        username: string;
    }>;
    getOfflineSigner(chainId: string): Web3AuthCustomSigner;
    getOfflineSignerAmino(): OfflineAminoSigner;
    getOfflineSignerDirect(chainId: string): Web3AuthCustomSigner;
}

export { Web3AuthCustomSigner as W, Web3AuthClient as a };
