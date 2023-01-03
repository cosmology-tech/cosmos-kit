import { StdSignDoc } from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import { ChainRecord, DirectSignDoc, SignOptions, WalletClient } from '@cosmos-kit/core';
import { BroadcastMode, Omni } from '@omni-wallet/types';
export declare class OmniClient implements WalletClient {
    readonly client: Omni;
    constructor(client: Omni);
    enable(chainIds: string | string[]): Promise<void>;
    getAccount(chainId: string): Promise<{
        name: any;
        address: any;
        algo: Algo;
        pubkey: any;
    }>;
    getOfflineSigner(chainId: string): any;
    addChain(chainInfo: ChainRecord): Promise<void>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<any>;
    signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions): Promise<any>;
    sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode): Promise<any>;
}
