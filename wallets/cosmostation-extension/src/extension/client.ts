import {
  getStringFromUint8Array,
  Namespace,
  WalletClient,
  WalletClientBase,
  Args,
  Resp,
  ReqArgs,
  WalletClientOptions,
} from '@cosmos-kit/core';
import { CosmosWalletAccount } from '@cosmos-kit/cosmos';

import {
  BroadcastResult,
  Cosmostation,
  SignAndBroadcastResult,
  VerifyResult,
  VerifyParams,
  GetAccountResult,
  SignParamsType,
  VerifyParamsType,
  BroadcastParamsType,
  SignAndBroadcastParamsType,
} from './types';
import { SignResult } from './types';
import { discriminators } from './config';
import { AddChainParams } from '@cosmostation/extension-client/types/message';

export class CosmostationClient
  extends WalletClientBase
  implements WalletClient {
  readonly client: Cosmostation;
  private eventMap: Map<
    string,
    Map<EventListenerOrEventListenerObject, Event>
  > = new Map();

  constructor(client: Cosmostation, options?: WalletClientOptions) {
    super(discriminators, options);
    this.client = client;
  }

  get cosmos() {
    return this.client.cosmos;
  }

  get ikeplr() {
    return this.client.providers.keplr;
  }

  protected _getRequestor(namespace: Namespace) {
    switch (namespace) {
      case 'cosmos':
        return this.client.cosmos;
      case 'ethereum':
        return this.client.ethereum;
      case 'aptos':
        return this.client.aptos;
      case 'sui':
        return this.client.sui;
      default:
        throw new Error(`Unmatched namespace ${namespace} in _getRequestor`);
    }
  }

  protected async _request(args: ReqArgs): Promise<unknown> {
    const { method, namespace, params } = args;
    let _params: unknown = params;
    switch (method) {
      case 'cos_enable':
        return await this.ikeplr.enable(
          (params as Args.AuthRelated['params']).chainIds
        );

      case 'ikeplr_verifyArbitrary':
        const p = params as VerifyParams.Cosmos.Arbitrary;
        return await this.ikeplr.verifyArbitrary(
          p.chainId,
          p.signer,
          p.data,
          p.signature
        );

      case 'cos_requestAccount':
        const chainId = (params as Args.GetAccount['params']).chainId;
        if (chainId === null) {
          return Promise.reject(
            'Make sure chainId is provided when requesting Cosmos accounts.'
          );
        }
        _params = { chainName: chainId };
        break;

      case 'eth_requestAccounts':
      case 'aptos_account':
      case 'sui_getAccount':
      case 'sui_getPublicKey':
        _params = void 0;
        break;

      case 'wallet_switchEthereumChain':
        _params = [params];
        break;
    }
    const resp = await this._getRequestor(namespace).request({
      method,
      params: _params,
    });
    return resp;
  }

  async getAccount(args: Args.GetAccount): Promise<Resp.GetAccount> {
    const rawList = await this._getAccount(args);
    const { namespace } = args;

    let account: Resp.GetAccount['neat']['account'];
    switch (namespace) {
      case 'cosmos':
        const key = rawList[0].resp as GetAccountResult.Cosmos;
        account = [
          {
            chainId: args.params.chainId,
            namespace,
            username: key.name,
            address: {
              value: key.address,
              encoding: 'bech32',
            },
            publicKey: {
              value: getStringFromUint8Array(key.publicKey, 'hex'),
              encoding: 'hex',
              algo: key.algo,
            },
          },
        ] as CosmosWalletAccount[];
        break;
      case 'ethereum':
        const ethAddrs = rawList[0].resp as string[];
        account = ethAddrs.map((address) => ({
          namespace,
          address,
        }));
        break;
      case 'aptos':
        const { address, publicKey } = rawList[0]
          .resp as GetAccountResult.Aptos;
        account = [{ namespace, address, publicKey }];
        break;
      case 'sui':
        let suiAddrs: string[], suiPublicKey: string;
        rawList.forEach(({ method, resp }) => {
          switch (method) {
            case 'sui_getAccount':
              suiAddrs = resp as string[];
              break;
            case 'sui_getPublicKey':
              suiPublicKey = resp as string;
              break;
          }
        });
        account = suiAddrs.map((address) => ({
          namespace,
          address,
          publicKey: suiPublicKey,
        }));
        break;
      default:
        break;
    }

    return { neat: { account }, raw: rawList };
  }

  async addChain(args: Args.AddChain<AddChainParams>): Promise<Resp.Void> {
    return { raw: await this._addChain(args) };
  }

  async sign(args: Args.DocRelated<SignParamsType>): Promise<Resp.Sign> {
    const raw = await this._sign(args);

    let neat: Resp.Sign['neat'];
    switch (raw.method) {
      case 'cos_signMessage':
        const { pub_key, signature } = raw.resp as SignResult.Cosmos.Message;
        neat = {
          publicKey: {
            value: pub_key.value,
            algo: pub_key.type,
          },
          signature: signature,
        };
        break;

      case 'cos_signAmino':
      case 'cos_signDirect':
        const {
          pub_key: docPubKey,
          signature: docSignature,
          signed_doc,
        } = raw.resp as SignResult.Cosmos.Direct | SignResult.Cosmos.Amino;
        neat = {
          publicKey: {
            value: docPubKey.value,
            algo: docPubKey.type,
          },
          signature: docSignature,
          signedDoc: signed_doc,
        };
        break;

      case 'eth_sign':
      case 'eth_signTransaction':
      case 'eth_signTypedData_v3':
      case 'eth_signTypedData_v4':
      case 'aptos_signTransaction':
        neat = {
          signature: neat as
            | SignResult.Ethereum.Sign
            | SignResult.Ethereum.Transaction
            | SignResult.Ethereum.TypedDataV3
            | SignResult.Ethereum.TypedDataV4
            | SignResult.Aptos.Transaction,
        };
        break;

      case 'aptos_signMessage':
        const {
          signature: aptosSignature,
        } = raw.resp as SignResult.Aptos.Message;
        neat = { signature: aptosSignature };
        break;

      default:
        return Promise.reject(`Unmatched method: ${raw.method}.`);
    }
    return { neat, raw };
  }

  async verify(args: Args.DocRelated<VerifyParamsType>): Promise<Resp.Verify> {
    const raw = await this._verify(args);

    let neat: Resp.Verify['neat'];
    switch (raw.method) {
      case 'cos_verifyMessage':
        neat = { isValid: raw.resp as VerifyResult.Cosmos.Message };
        break;

      default:
        return Promise.reject(`Unmatched methos: ${raw.method}.`);
    }
    return { neat, raw };
  }

  async broadcast(
    args: Args.DocRelated<BroadcastParamsType>
  ): Promise<Resp.Broadcast> {
    const raw = await this._broadcast(args);

    let neat: Resp.Broadcast['neat'];
    switch (raw.method) {
      case 'cos_sendTransaction':
        const {
          tx_response: { txhash, height, timestamp },
        } = raw.resp as BroadcastResult.Cosmos.Transaction;
        neat = {
          block: {
            hash: txhash,
            height: height as string,
            timestamp: timestamp as string,
          },
        };
        break;

      default:
        return Promise.reject(`Unmatched method: ${raw.method}.`);
    }
    return { neat, raw };
  }

  async signAndBroadcast(
    args: Args.DocRelated<SignAndBroadcastParamsType>
  ): Promise<Resp.Broadcast> {
    const raw = await this._signAndBroadcast(args);

    let neat: Resp.Broadcast['neat'];
    switch (raw.method) {
      case 'aptos_signAndSubmitTransaction':
        const {
          hash,
          sequence_number,
        } = raw.resp as SignAndBroadcastResult.Aptos.Transaction;
        neat = {
          block: { hash, height: sequence_number },
        };
        break;

      case 'sui_signAndExecuteTransaction':
        const { digest } = raw.resp as SignAndBroadcastResult.Sui.Transaction;
        neat = {
          block: { hash: digest },
        };
        break;

      default:
        return Promise.reject(`Unmatched method: ${raw.method}.`);
    }
    return { neat, raw };
  }

  on(type: string, listener: EventListenerOrEventListenerObject): void {
    const event = this.cosmos.on(type, listener);
    const typeEventMap: Map<EventListenerOrEventListenerObject, Event> =
      this.eventMap.get(type) || new Map();
    typeEventMap.set(listener, event);
    this.eventMap.set(type, typeEventMap);
  }

  off(type: string, listener: EventListenerOrEventListenerObject): void {
    const event = this.eventMap.get(type)?.get(listener);
    if (event) {
      this.cosmos.off(event);
    }
  }
}
