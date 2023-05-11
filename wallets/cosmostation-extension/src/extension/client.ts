import {
  AddRaw,
  AuthRange,
  BroadcastResp,
  getStringFromUint8Array,
  Namespace,
  Dist,
  Method,
  SignResp,
  VerifyResp,
  WalletAccount,
  WalletClient,
  WalletClientBase,
  NamespaceData,
} from '@cosmos-kit/core';
import { CosmosWalletAccount } from '@cosmos-kit/cosmos';
import { AddChainParams } from '@cosmostation/extension-client/types/message';

import {
  BroadcastOptionsMap,
  BroadcastParamsType,
  BroadcastResult,
  Cosmostation,
  CosmostationOptions,
  SignAndBroadcastParamsType,
  SignOptionsMap,
  WalletAddEthereumChainParam,
  SignAndBroadcastResult,
  VerifyParamsType,
  VerifyOptionsMap,
  VerifyResult,
  SignAndBroadcastOptionsMap,
  VerifyParams,
} from './types';
import { SignParamsType, SignResult } from './types';
import { discriminators } from './config';

export class CosmostationClient
  extends WalletClientBase
  implements WalletClient {
  readonly client: Cosmostation;
  readonly options?: CosmostationOptions;
  private eventMap: Map<
    string,
    Map<EventListenerOrEventListenerObject, Event>
  > = new Map();

  constructor(client: Cosmostation, options?: CosmostationOptions) {
    super(discriminators, options);
    this.client = client;
  }

  get cosmos() {
    return this.client.cosmos;
  }

  get ikeplr() {
    return this.client.providers.keplr;
  }

  async enable(range: NamespaceData<AuthRange, unknown>[]): Promise<void> {
    await Promise.all(
      range.map(async (args) => {
        await this._enable({ ...args, data: void 0 });
      })
    );
  }

  async disable(range: NamespaceData<AuthRange, unknown>[]): Promise<void> {
    await Promise.all(
      range.map(async (args) => {
        await this._disable({ ...args, data: void 0 });
      })
    );
  }

  async getAccount(
    authRange: AuthRange,
    options?: unknown
  ): Promise<AddRaw<WalletAccount>[]> {
    const accountsList = await Promise.all(
      Object.entries(authRange).map(async ([namespace, { chainIds }]) => {
        switch (namespace) {
          case 'cosmos':
            if (!chainIds) {
              return Promise.reject('No chainIds provided.');
            }
            return Promise.all(
              chainIds.map(async (chainId) => {
                const key = (await this.cosmos.request({
                  method: 'cos_requestAccount',
                  params: { chainName: chainId },
                })) as {
                  name: string;
                  address: string;
                  publicKey: Uint8Array;
                  isLedger: boolean;
                  algo: Algo;
                };
                return {
                  chainId,
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
                } as CosmosWalletAccount;
              })
            );
          case 'ethereum':
            const ethAddrs = (await this.client.ethereum.request({
              method: 'eth_requestAccounts',
            })) as string[];
            return ethAddrs.map((address) => {
              return {
                namespace,
                address: {
                  value: address,
                  encoding: 'hex',
                },
              } as WalletAccount;
            });
          case 'aptos':
            const { address, publicKey } = (await this.client.aptos.request({
              method: 'aptos_account',
            })) as {
              address: string;
              publicKey: string;
            };
            return [
              {
                namespace,
                address: {
                  value: address,
                  encoding: 'hex',
                },
                publicKey: {
                  value: publicKey,
                  encoding: 'hex',
                },
              } as WalletAccount,
            ];
          case 'sui':
            const suiAddrs = (await this.client.sui.request({
              method: 'sui_getAccount',
            })) as string[];
            const suiPublicKey = (await this.client.sui.request({
              method: 'sui_getPublicKey',
            })) as string;
            return suiAddrs.map((address) => {
              return {
                namespace,
                address: {
                  value: address,
                  encoding: 'hex',
                },
                publicKey: {
                  value: suiPublicKey,
                  encoding: 'hex',
                },
              } as WalletAccount;
            });
          default:
            return Promise.reject(`Unmatched namespace: ${namespace}.`);
        }
      })
    );
    return accountsList.flat();
  }

  async addChain(
    namespace: Namespace,
    chainInfo: unknown,
    options?: unknown
  ): Promise<void> {
    switch (namespace) {
      case 'cosmos':
        this.client.cosmos.request({
          method: 'cos_addChain',
          params: chainInfo as AddChainParams,
        });
        return;
      case 'ethereum':
        this.client.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: chainInfo as WalletAddEthereumChainParam,
        });
        return;
      default:
        return Promise.reject(`Unmatched namespace: ${namespace}.`);
    }
  }

  async switchChain(
    namespace: Namespace,
    chainId: string,
    options?: unknown
  ): Promise<void> {
    switch (namespace) {
      case 'ethereum':
        await this.client.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
        return;
      default:
        return Promise.reject(`Unmatched namespace: ${namespace}.`);
    }
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

  protected async _request(
    namespace: Namespace,
    method: string,
    params: unknown,
    options?: Dist<Method>
  ) {
    let _params: unknown = params;
    switch (method) {
      case 'ikeplr_enable':
        return await this.ikeplr.enable((params as AuthRange).chainIds);

      case 'ikeplr_verifyArbitrary':
        const p = params as VerifyParams.Cosmos.Arbitrary;
        return await this.ikeplr.verifyArbitrary(
          p.chainId,
          p.signer,
          p.data,
          p.signature
        );

      case 'cos_signAmino':
      case 'cos_signDirect':
        _params = { ...(params as object), ...options?.cosmos };
        break;
    }
    const resp = await this._getRequestor(namespace).request({
      method,
      params: _params,
    });
    return resp;
  }

  async sign(
    args: NamespaceData<SignParamsType, SignOptionsMap>
  ): Promise<AddRaw<SignResp>> {
    const raw = await this._sign(args);

    let resp: SignResp;
    switch (raw.method) {
      case 'cos_signMessage':
        const { pub_key, signature } = raw.resp as SignResult.Cosmos.Message;
        resp = {
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
        resp = {
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
        resp = {
          signature: resp as
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
        resp = { signature: aptosSignature };
        break;

      default:
        return Promise.reject(`Unmatched method: ${raw.method}.`);
    }
    return { ...resp, raw };
  }

  async verify(
    args: NamespaceData<VerifyParamsType, VerifyOptionsMap>
  ): Promise<AddRaw<VerifyResp>> {
    const raw = await this._verify(args);

    let resp: VerifyResp;
    switch (raw.method) {
      case 'cos_verifyMessage':
        resp = { isValid: raw.resp as VerifyResult.Cosmos.Message };
        break;

      default:
        return Promise.reject(`Unmatched methos: ${raw.method}.`);
    }
    return { ...resp, raw };
  }

  async broadcast(
    args: NamespaceData<BroadcastParamsType, BroadcastOptionsMap>
  ): Promise<AddRaw<BroadcastResp>> {
    const raw = await this._broadcast(args);

    let resp: BroadcastResp;
    switch (raw.method) {
      case 'cos_sendTransaction':
        const {
          tx_response: { txhash, height, timestamp },
        } = raw.resp as BroadcastResult.Cosmos.Transaction;
        resp = {
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
    return { ...resp, raw };
  }

  async signAndBroadcast(
    args: NamespaceData<SignAndBroadcastParamsType, SignAndBroadcastOptionsMap>
  ): Promise<AddRaw<BroadcastResp>> {
    const raw = await this._signAndBroadcast(args);

    let resp: BroadcastResp;
    switch (raw.method) {
      case 'aptos_signAndSubmitTransaction':
        const {
          hash,
          sequence_number,
        } = raw.resp as SignAndBroadcastResult.Aptos.Transaction;
        resp = {
          block: { hash, height: sequence_number },
        };
        break;

      case 'sui_signAndExecuteTransaction':
        const { digest } = raw.resp as SignAndBroadcastResult.Sui.Transaction;
        resp = {
          block: { hash: digest },
        };
        break;

      default:
        return Promise.reject(`Unmatched method: ${raw.method}.`);
    }
    return { ...resp, raw };
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
