import { StdSignDoc } from '@cosmjs/amino';
import {
  Args,
  ChainRecord,
  DirectSignDoc,
  getStringFromUint8Array,
  ReqArgs,
  Resp,
  SignOptions,
  WalletAccount,
  WalletClientBase,
  WalletClientOptions,
} from '@cosmos-kit/core';
import {
  AminoSignResponse,
  BroadcastMode,
  ChainInfo,
  DirectSignResponse,
  Keplr,
} from '@keplr-wallet/types';
import { discriminators } from './config';
import { chainRecordToKeplr } from './utils';
import {
  GetAccountParams,
  GetAccountParamsType,
  GetAccountResp,
  KeplrTypeParams,
  SignParams,
  SignParamsType,
  SignResp,
} from './types';

export class KeplrClient extends WalletClientBase<KeplrTypeParams> {
  readonly client: Keplr;
  readonly options?: WalletClientOptions;

  constructor(client: Keplr, options?: WalletClientOptions) {
    super(discriminators, options);
    this.client = client;
  }

  async _request(args: ReqArgs): Promise<unknown> {
    const { method, params } = args;
    switch (method) {
      case 'ikeplr_enable':
        const p1 = params as Args.AuthRelated['params'];
        return await this.client.enable(p1.chainIds);

      case 'ikeplr_disable':
        const p2 = params as Args.AuthRelated['params'];
        return await this.client.disable(p2.chainIds);

      case 'ikeplr_experimentalSuggestChain':
        const p3 = params as ChainInfo;
        return await this.client.experimentalSuggestChain(p3);

      case 'ikeplr_addChainRecord':
        const p4 = chainRecordToKeplr(params as ChainRecord);
        return await this.client.experimentalSuggestChain(p4);

      case 'ikeplr_getKey':
        const p5 = params as GetAccountParams.Cosmos.Key;
        return await this.client.getKey(p5.chainId);

      case 'ikeplr_getEnigmaPubKey':
        const p6 = params as GetAccountParams.Cosmos.EnigmaPubKey;
        return await this.client.getEnigmaPubKey(p6.chainId);

      case 'ikeplr_getEnigmaTxEncryptionKey':
        const p7 = params as GetAccountParams.Cosmos.EnigmaTxEncryptionKey;
        return await this.client.getEnigmaTxEncryptionKey(p7.chainId, p7.nonce);

      case 'ikeplr_getSecret20ViewingKey':
        const p8 = params as GetAccountParams.Cosmos.Secret20ViewingKey;
        return await this.client.getSecret20ViewingKey(
          p8.chainId,
          p8.contractAddress
        );

      case 'ikeplr_signAmino':
        const p9 = params as SignParams.Cosmos.Amino;
        return await this.client.signAmino(
          p9.chainId,
          p9.signer,
          p9.signDoc,
          p9.signOptions
        );

      case 'ikeplr_signDirect':
        const p10 = params as SignParams.Cosmos.Direct;
        return await this.client.signDirect(
          p10.chainId,
          p10.signer,
          p10.signDoc,
          p10.signOptions
        );

      case 'ikeplr_signICNSAdr36':
        const p11 = params as
          | SignParams.Cosmos.ICNSAdr36
          | SignParams.Ethereum.ICNSAdr36;
        return await this.client.signICNSAdr36(
          p11.chainId,
          p11.contractAddress,
          p11.owner,
          p11.username,
          p11.addressChainIds
        );

      case 'ikeplr_signArbitrary':
        const p12 = params as SignParams.Cosmos.Arbitrary;
        return await this.client.signArbitrary(
          p12.chainId,
          p12.signer,
          p12.data
        );

      case 'ikeplr_signEthereum':
        const p13 = params as SignParams.Ethereum.Ethereum;
        return await this.client.signEthereum(
          p13.chainId,
          p13.signer,
          p13.data,
          p13.type
        );

      case 'ikeplr_verifyArbitrary':
        p = params as VerifyParams.Cosmos.Arbitrary;
        return await this.client.verifyArbitrary(
          p.chainId,
          p.signer,
          p.data,
          p.signature
        );
    }
  }

  async getAccount(
    args: Args.GetAccount<GetAccountParamsType>
  ): Promise<Resp.GetAccount> {
    const rawList = await this._getAccount(args);
    const account: WalletAccount = {
      namespace: args.namespace,
      keys: [],
      chainId: args.params.chainId,
    };
    rawList.forEach(({ resp, method }) => {
      switch (method) {
        case 'ikeplr_getKey':
          const { name, bech32Address, pubKey, algo } =
            resp as GetAccountResp.Cosmos.Key;
          account.keys.push({ value: bech32Address, type: 'address/bech32' });
          account.keys.push({
            value: getStringFromUint8Array(pubKey),
            type: 'public',
            algo,
            encoding: 'hex',
          });
          account.username = name;
          break;
        case 'ikeplr_getEnigmaPubKey':
        case 'ikeplr_getEnigmaTxEncryptionKey':
          account.keys.push({
            value: getStringFromUint8Array(
              resp as GetAccountResp.Cosmos.EnigmaPubKey
            ),
            type:
              method === 'ikeplr_getEnigmaPubKey'
                ? 'public/enigma'
                : 'public/enigmaTxEncryption',
            encoding: 'hex',
          });
          break;
        case 'ikeplr_getSecret20ViewingKey':
          account.keys.push({
            value: resp as GetAccountResp.Cosmos.Secret20ViewingKey,
            type: 'secret20viewing',
          });
          break;
        default:
          this.logger?.warn(
            `The transformation (raw => neat) of method ${method} not implemented.`
          );
      }
    });
    return { neat: { accounts: [account] }, raw: rawList };
  }

  async sign(args: Args.DocRelated<SignParamsType>): Promise<Resp.Sign> {
    const raw = await this._sign(args);
    let neat: Resp.Sign['neat'];
    switch (raw.method) {
      case 'ikeplr_signAmino':
      case 'ikeplr_signDirect':
        const {
          signed,
          signature: { signature, pub_key },
        } = raw.resp as SignResp.Cosmos.Amino | SignResp.Cosmos.Direct;
        neat = {
          signedDoc: signed,
          signature: signature,
          publicKey: {
            value: pub_key.value,
            type: pub_key.type as KeyType,
          },
        };
        break;
      default:
        this.logger?.warn(
          `The transformation (raw => neat) of method ${raw.method} not implemented.`
        );
    }
    return { neat, raw };
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ) {
    return await this.client.signAmino(chainId, signer, signDoc, signOptions);
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ) {
    return await this.client.signDirect(chainId, signer, signDoc, signOptions);
  }

  async sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode) {
    return await this.client.sendTx(chainId, tx, mode);
  }
}
