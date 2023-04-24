import { AccountData } from '@cosmjs/proto-signing';
import { OfflineAminoSigner, AminoSignResponse, StdSignDoc } from '@cosmjs/amino';
import { WalletAccount } from '@cosmos-kit/core';
import { StationExtension } from './extension';
export declare class OfflineSigner implements OfflineAminoSigner {
    private extension;
    accountInfo: WalletAccount;
    constructor(extension: StationExtension, accountInfo: WalletAccount);
    getAccounts(): Promise<readonly AccountData[]>;
    signAmino(signerAddress: string, signDoc: StdSignDoc): Promise<AminoSignResponse>;
}
