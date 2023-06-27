import { Wallet, SignOptions, DirectSignDoc } from '@cosmos-kit/core';
import { WCClient } from '@cosmos-kit/walletconnect';
import { StdSignDoc, AminoSignResponse } from '@cosmjs/amino';
import { DirectSignResponse } from '@cosmjs/proto-signing';

declare class TrustClient extends WCClient {
    constructor(walletInfo: Wallet);
    getOfflineSignerAmino: any;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<AminoSignResponse>;
    signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions): Promise<DirectSignResponse>;
}

export { TrustClient };
