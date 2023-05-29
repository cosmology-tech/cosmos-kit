import { chainRegistryChainToKeplr } from '@chain-registry/keplr';
import {  StdSignDoc } from '@cosmjs/amino';
import { Algo, OfflineDirectSigner } from '@cosmjs/proto-signing';
import {
  Args,
  ChainRecord,
  DirectSignDoc,
  ExtendedHttpEndpoint,
  getStringFromUint8Array,
  ReqArgs,
  Resp,
  SignOptions,
  SignType,
  WalletClient,
  WalletClientBase,
  WalletClientOptions,
} from '@cosmos-kit/core';
import { CosmosWalletAccount } from '@cosmos-kit/cosmos';
import { AminoSignResponse, BroadcastMode, ChainInfo, DirectSignResponse, Keplr, Key } from '@keplr-wallet/types';
import { discriminators } from './config';
import { KeplrTypeParams } from '../types';
import { chainRecordToKeplr } from './utils';

export class KeplrClient extends WalletClientBase<KeplrTypeParams> {
  readonly client: Keplr;
  readonly options?: WalletClientOptions;

  constructor(client: Keplr, options?: WalletClientOptions;) {
    super(discriminators, options);
    this.client = client;
    
  }

  protected async _request(args: ReqArgs): Promise<unknown> {
    const { method, params } = args;
    switch (method) {
      case 'ikeplr_enable':
        return await this.client.enable(
          (params as Args.AuthRelated['params']).chainIds
        );

      case 'ikeplr_disable':
        return await this.client.disable(
          (params as Args.AuthRelated['params']).chainIds
        );

      case 'ikeplr_experimentalSuggestChain':
        return await this.client.experimentalSuggestChain(params as ChainInfo);

      case 'ikeplr_addChainRecord':
        return await this.client.experimentalSuggestChain(
          chainRecordToKeplr(params as ChainRecord)
        );

        case 'ikeplr_getKey':
          return await this.client.getKey(
            (params as Args.GetAccount['params']).chainId
          );

      case 'ikeplr_verifyArbitrary':
        const p = params as VerifyParams.Cosmos.Arbitrary;
        return await this.client.verifyArbitrary(
          p.chainId,
          p.signer,
          p.data,
          p.signature
        );
  }
}

async getAccount(args: Args.GetAccount): Promise<Resp.GetAccount> {
  const rawList = await this._getAccount(args);
  const account = rawList.map(({resp}) => {
    const {name, bech32Address, pubKey, algo} = resp as Key
      return {
        username: name,
        address: {
          value: bech32Address,
          encoding: 'bech32'
        },
        keys: {
          value: getStringFromUint8Array(pubKey, 'hex'),
          encoding: 'hex',
          algo,
        }
      } as CosmosWalletAccount
      })
    return {neat: {accounts: account}, raw: rawList}
}

sign(args: Args.DocRelated<KeplrTypeParams['sign']>): Promise<Resp.Sign> {
  const raw = await this._sign(args);
  let neat: Resp.Sign['neat'];
  switch (raw.method) {
    case 'ikeplr_signAmino':
      case 'ikeplr_signDirect':
      const {signed, signature} = raw.resp as AminoSignResponse|DirectSignResponse;
      neat = {signedDoc: signed, signature: signature.signature, publicKey: signature.pub_key}
      break;
    default:
      return Promise.reject(`Unmatched method: ${raw.method}.`);
  }
  return {neat, raw}
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
