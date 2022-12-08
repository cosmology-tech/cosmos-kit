import { StdSignDoc } from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import { ChainRecord, DirectSignDoc, SignOptions, WalletClient } from '@cosmos-kit/core';
import { BroadcastMode, Keplr } from '@keplr-wallet/types';
export declare class KeplrClient implements WalletClient {
    readonly client: Keplr;
    constructor(client: Keplr);
    enable(chainIds: string | string[]): Promise<void>;
    getAccount(chainId: string): Promise<{
        name: string;
        address: string;
        algo: Algo;
        pubkey: Uint8Array;
    }>;
    getOfflineSigner(chainId: string): import("@keplr-wallet/types").OfflineAminoSigner & import("@keplr-wallet/types").OfflineDirectSigner;
    addChain(chainInfo: ChainRecord): Promise<void>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<import("@keplr-wallet/types").AminoSignResponse>;
    signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions): Promise<import("@keplr-wallet/types").DirectSignResponse>;
    sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
}
