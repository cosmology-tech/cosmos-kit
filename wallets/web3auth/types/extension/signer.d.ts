import { AccountData, DirectSecp256k1Wallet, DirectSignResponse, OfflineDirectSigner } from '@cosmjs/proto-signing';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Web3AuthClient } from './client';
export declare class Web3AuthCustomSigner implements OfflineDirectSigner {
    client: Web3AuthClient;
    chainId: string;
    constructor(client: Web3AuthClient, chainId: string);
    getSigner(chainId: string): Promise<DirectSecp256k1Wallet>;
    getAccounts(): Promise<readonly AccountData[]>;
    signDirect(signerAddress: string, signDoc: SignDoc): Promise<DirectSignResponse>;
}
