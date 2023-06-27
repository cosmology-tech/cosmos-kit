import { AccountData } from '@cosmjs/proto-signing';
import { OfflineAminoSigner, StdSignDoc, AminoSignResponse } from '@cosmjs/amino';
import { WalletAccount } from '@cosmos-kit/core';
import { StationExtension } from './extension.js';
import '@terra-money/feather.js';
import './types.js';

declare class OfflineSigner implements OfflineAminoSigner {
    private extension;
    accountInfo: WalletAccount;
    constructor(extension: StationExtension, accountInfo: WalletAccount);
    getAccounts(): Promise<readonly AccountData[]>;
    signAmino(signerAddress: string, signDoc: StdSignDoc): Promise<AminoSignResponse>;
}

export { OfflineSigner };
