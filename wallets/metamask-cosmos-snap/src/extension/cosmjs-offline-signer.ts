import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { AccountData, AminoSignResponse, StdSignDoc } from '@cosmjs/amino';
import { getKey, requestSignDirect, requestSignAmino } from './snap';
import { DirectSignResponse, OfflineDirectSigner } from '@cosmjs/proto-signing';

export class cosmjsOfflineSigner implements OfflineDirectSigner {
  private chainId: string;
  constructor(chainId: string) {
    this.chainId = chainId;
  }

  async getAccounts(): Promise<AccountData[]> {
    const key = await getKey(this.chainId);
    return [
      {
        address: key.bech32Address,
        algo: 'secp256k1',
        pubkey: key.pubKey,
      },
    ];
  }

  async signDirect(
    signerAddress: string,
    signDoc: SignDoc
  ): Promise<DirectSignResponse> {
    if (this.chainId !== signDoc.chainId) {
      throw new Error('Chain ID does not match signer chain ID');
    }
    const accounts = await this.getAccounts();

    if (accounts.find((account) => account.address !== signerAddress)) {
      throw new Error('Signer address does not match wallet address');
    }

    return (requestSignDirect(
      this.chainId,
      signerAddress,
      signDoc
    ) as unknown) as Promise<DirectSignResponse>;
  }

  async signAmino(
    signerAddress: string,
    signDoc: StdSignDoc
  ): Promise<AminoSignResponse> {
    if (this.chainId !== signDoc.chain_id) {
      throw new Error('Chain ID does not match signer chain ID');
    }
    const accounts = await this.getAccounts();

    if (accounts.find((account) => account.address !== signerAddress)) {
      throw new Error('Signer address does not match wallet address');
    }

    return (requestSignAmino(
      this.chainId,
      signerAddress,
      signDoc
    ) as unknown) as Promise<AminoSignResponse>;
  }
}

export function getOfflineSigner(chainId: string) {
  return new cosmjsOfflineSigner(chainId);
}
