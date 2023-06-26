/// <reference types="node" />
import { StdSignDoc } from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import { WalletClient } from '@cosmos-kit/core';
import Cosmos from "@ledgerhq/hw-app-cosmos";
export declare class LedgerClient implements WalletClient {
    client: Cosmos;
    constructor(client: Cosmos);
    getSimpleAccount(chainId: string, accountIndex?: number): Promise<{
        namespace: string;
        chainId: string;
        address: string;
        username: string;
    }>;
    getAccount(chainId: string, accountIndex?: number, username?: string): Promise<{
        username: string;
        address: string;
        algo: Algo;
        pubkey: Uint8Array;
        isNanoLedger: boolean;
    }>;
    sign(signDoc: StdSignDoc, accountIndex?: number): Promise<{
        signature: Buffer;
        return_code: string | number;
    }>;
}
