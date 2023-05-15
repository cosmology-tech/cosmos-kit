import { chainRegistryChainToKeplr } from '@chain-registry/keplr';
import { StdSignDoc } from '@cosmjs/amino';
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
import { BroadcastMode, ChainInfo, Keplr, Key } from '@keplr-wallet/types';
import { discriminators } from '../config';

export class KeplrClient extends WalletClientBase implements WalletClient {
  readonly client: Keplr;
  readonly options?: WalletClientOptions;

  constructor(client: Keplr, options?: WalletClientOptions;) {
    super(discriminators, options);
    this.client = client;
    
  }

  protected async _request(args: ReqArgs): Promise<unknown> {
    const { method, params } = args;
    switch (method) {
      case 'cos_enable':
        return await this.client.enable(
          (params as Args.AuthRelated['params']).chainIds
        );
        case 'cos_getKey':
          return await this.client.getKey(
            (params as Args.GetAccount['params']).chainId
          );
          case 'cos_experimentalSuggestChain':
            return await this.client.experimentalSuggestChain((params as Args.AddChain<ChainInfo>['params']).chainInfo);
  }
}

async getAccount(args: Args.GetAccount): Promise<Resp.GetAccount> {
  const rawList = await this._getAccount(args)
  const account = rawList.map(({resp}) => {
    const {name, bech32Address, pubKey, algo} = resp as Key
      return {
        username: name,
        address: {
          value: bech32Address,
          encoding: 'bech32'
        },
        publicKey: {
          value: getStringFromUint8Array(pubKey, 'hex'),
          encoding: 'hex',
          algo,
        }
      } as CosmosWalletAccount
      })
    return {neat: {account}, raw: rawList}
}

async addChain(args: Args.AddChain<ChainInfo | ChainRecord>): Promise<Resp.Void> {
  return { raw: await this._addChain(args) };
}

  // async addChain(chainInfo: ChainRecord) {
  //   const suggestChain = chainRegistryChainToKeplr(
  //     chainInfo.chain,
  //     chainInfo.assetList ? [chainInfo.assetList] : []
  //   );

  //   if (chainInfo.preferredEndpoints?.rest?.[0]) {
  //     (suggestChain.rest as
  //       | string
  //       | ExtendedHttpEndpoint) = chainInfo.preferredEndpoints?.rest?.[0];
  //   }

  //   if (chainInfo.preferredEndpoints?.rpc?.[0]) {
  //     (suggestChain.rpc as
  //       | string
  //       | ExtendedHttpEndpoint) = chainInfo.preferredEndpoints?.rpc?.[0];
  //   }

  //   await this.client.experimentalSuggestChain(suggestChain);
  // }

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
