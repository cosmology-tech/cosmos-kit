import { OfflineAminoSigner } from '@cosmjs/amino';
import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';
import { WalletClient } from '@cosmos-kit/core';
import { Web3Auth } from '@web3auth/modal';
import { Web3AuthCustomSigner } from './signer';
export declare class Web3AuthClient implements WalletClient {
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
        algo: import("@cosmjs/proto-signing").Algo;
        pubkey: Uint8Array;
        username: string;
    }>;
    getOfflineSigner(chainId: string): Web3AuthCustomSigner;
    getOfflineSignerAmino(): OfflineAminoSigner;
    getOfflineSignerDirect(chainId: string): Web3AuthCustomSigner;
}
