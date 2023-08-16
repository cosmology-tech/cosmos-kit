import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { AccountData, AminoSignResponse, StdSignDoc } from '@cosmjs/amino';
import { DirectSignResponse, OfflineDirectSigner } from '@cosmjs/proto-signing';
export declare class cosmjsOfflineSigner implements OfflineDirectSigner {
    private chainId;
    constructor(chainId: string);
    getAccounts(): Promise<AccountData[]>;
    signDirect(signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse>;
    signAmino(signerAddress: string, signDoc: StdSignDoc): Promise<AminoSignResponse>;
}
export declare function getOfflineSigner(chainId: string): cosmjsOfflineSigner;
