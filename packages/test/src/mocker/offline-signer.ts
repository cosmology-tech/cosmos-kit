import {
  AccountData,
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignDoc,
} from '@cosmjs/amino';
import { Algo, OfflineDirectSigner } from '@cosmjs/proto-signing';
import { DirectSignResponse } from '@cosmjs/proto-signing/build/signer';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import Long from 'long';

import { Mock, MockSignOptions } from '../mock-extension';

export class CosmJSOfflineSignerOnlyAmino implements OfflineAminoSigner {
  constructor(
    protected readonly chainId: string,
    protected readonly mock: Mock,
    protected signOptions?: MockSignOptions
  ) {}

  async getAccounts(): Promise<AccountData[]> {
    const key = await this.mock.getKey(this.chainId);
    return [
      {
        address: key.bech32Address,
        algo: key.algo as Algo,
        pubkey: key.pubKey,
      },
    ];
  }

  async signAmino(
    signerAddress: string,
    signDoc: StdSignDoc
  ): Promise<AminoSignResponse> {
    if (this.chainId !== signDoc.chain_id) {
      throw new Error('Unmatched chain id with the offline signer');
    }

    const key = await this.mock.getKey(signDoc.chain_id);

    if (key.bech32Address !== signerAddress) {
      throw new Error('Unknown signer address');
    }
    return this.mock.signAmino(
      this.chainId,
      signerAddress,
      signDoc,
      this.signOptions
    );
  }

  // Fallback function for the legacy cosmjs implementation before the staragte.
  async sign(
    signerAddress: string,
    signDoc: StdSignDoc
  ): Promise<AminoSignResponse> {
    return this.signAmino(signerAddress, signDoc);
  }
}

export class CosmJSOfflineSigner
  extends CosmJSOfflineSignerOnlyAmino
  implements OfflineAminoSigner, OfflineDirectSigner
{
  constructor(
    protected readonly chainId: string,
    protected readonly mock: Mock,
    protected signOptions?: MockSignOptions
  ) {
    super(chainId, mock, signOptions);
  }

  async signDirect(
    signerAddress: string,
    signDoc: SignDoc
  ): Promise<DirectSignResponse> {
    if (this.chainId !== signDoc.chainId) {
      throw new Error('Unmatched chain id with the offline signer');
    }

    const key = await this.mock.getKey(signDoc.chainId);

    if (key.bech32Address !== signerAddress) {
      throw new Error('Unknown signer address');
    }

    const _signDoc = {
      ...signDoc,
      accountNumber: Long.fromString(signDoc.accountNumber.toString()),
    };
    return this.mock.signDirect(
      this.chainId,
      signerAddress,
      _signDoc,
      this.signOptions
    );
  }
}
