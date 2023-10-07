import { AminoSignResponse, StdSignDoc } from '@cosmjs/amino';
import { DirectSignResponse } from '@cosmjs/proto-signing';
import { DirectSignDoc, SignOptions, Wallet } from '@cosmos-kit/core';
import { WCClient } from '@cosmos-kit/walletconnect';

export class OmniClient extends WCClient {
  constructor(walletInfo: Wallet) {
    super(walletInfo);
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ): Promise<AminoSignResponse> {
    const { signDoc: signed, signature } = (await this._signAmino(
      chainId,
      signer,
      signDoc,
      signOptions
    )) as any;
    return {
      signed,
      signature,
    };
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ): Promise<DirectSignResponse> {
    const { signDoc: signed, signature } = (await this._signDirect(
      chainId,
      signer,
      signDoc,
      signOptions
    )) as any;
    return {
      signed,
      signature,
    };
  }
}
