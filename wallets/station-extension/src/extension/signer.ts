import { AccountData } from '@cosmjs/proto-signing';
import {
  OfflineAminoSigner,
  AminoSignResponse,
  StdSignDoc,
  StdSignature,
} from '@cosmjs/amino';
import { WalletAccount } from '@cosmos-kit/core';
import { StationExtension } from './extension';
import {
  Fee as TerraFee,
  Msg as TerraMsg,
  SignatureV2,
} from '@terra-money/feather.js';

export class OfflineSigner implements OfflineAminoSigner {
  private extension: StationExtension;
  accountInfo: WalletAccount;

  constructor(extension: StationExtension, accountInfo: WalletAccount) {
    this.extension = extension;
    this.accountInfo = accountInfo;
  }

  async getAccounts(): Promise<readonly AccountData[]> {
    return [
      {
        address: this.accountInfo.address,
        algo: this.accountInfo.algo || 'secp256k1',
        pubkey: this.accountInfo.pubkey,
      },
    ];
  }

  async signAmino(
    signerAddress: string,
    signDoc: StdSignDoc
  ): Promise<AminoSignResponse> {
    const signDocFee = signDoc.fee;
    const feeAmount = signDocFee.amount[0].amount + signDocFee.amount[0].denom;
    const fakeMsgs = signDoc.msgs.map((msg) =>
      JSON.stringify(TerraMsg.fromAmino(msg as TerraMsg.Amino).toData())
    );

    const signResponse = await this.extension.sign({
      chainID: signDoc.chain_id,
      msgs: fakeMsgs,
      fee: new TerraFee(
        parseInt(signDocFee.gas),
        feeAmount,
        signDocFee.payer,
        signDocFee.granter
      ),
      memo: signDoc.memo,
      signMode: SignatureV2.SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
    } as any);

    const signature: StdSignature = {
      pub_key: (signResponse.payload.result.auth_info.signer_infos[0]
        .public_key as any).key,
      signature: signResponse.payload.result.signatures[0],
    };

    return {
      signed: signDoc,
      signature,
    };
  }
}
