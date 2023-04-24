/// <reference types="long" />
import { AccountData } from '@cosmjs/proto-signing';
import { OfflineAminoSigner, AminoSignResponse, StdSignDoc } from '@cosmjs/amino';
import { WalletAccount } from '@cosmos-kit/core';
import { TerraExtension } from './extension';
export interface SignDoc {
    bodyBytes: Uint8Array;
    authInfoBytes: Uint8Array;
    chainId: string;
    accountNumber: Long;
}
export declare class OfflineSigner implements OfflineAminoSigner {
    private extension;
    accountInfo: WalletAccount;
    constructor(extension: TerraExtension, accountInfo: WalletAccount);
    getAccounts(): Promise<readonly AccountData[]>;
    signAmino(signerAddress: string, signDoc: StdSignDoc): Promise<AminoSignResponse>;
}
