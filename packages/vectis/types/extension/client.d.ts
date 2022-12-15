import { StdSignDoc } from '@cosmjs/amino';
import { ChainRecord, DirectSignDoc, SignOptions, WalletClient } from '@cosmos-kit/core';
import type { Vectis } from './types';
export declare class VectisClient implements WalletClient {
    readonly client: Vectis;
    constructor(client: Vectis);
    enable(chainIds: string | string[]): Promise<void>;
    getAccount(chainId: string): Promise<any>;
    getOfflineSigner(chainId: string): Promise<any>;
    getOfflineSignerAmino(chainId: string): any;
    getOfflineSignerDirect(chainId: string): any;
    addChain({ chain, name, preferredEndpoints }: ChainRecord): Promise<void>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<any>;
    signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions): Promise<any>;
}
