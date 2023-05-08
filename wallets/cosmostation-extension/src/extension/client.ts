import { Algo } from '@cosmjs/amino';
import {
  AddRaw,
  AuthRange,
  BroadcastResponse,
  getMethod,
  getStringFromUint8Array,
  Namespace,
  DocRelatedOptions,
  SignResponse,
  WalletAccount,
  WalletClient,
} from '@cosmos-kit/core';
import { CosmosWalletAccount } from '@cosmos-kit/cosmos';
import {
  AddChainParams,
  VerifyMessageResponse,
} from '@cosmostation/extension-client/types/message';

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
} from './types';
import { SignParamsType, SignResult } from './types';
import { discriminators } from './config';

export class CosmostationClient implements WalletClient {
  readonly client: Cosmostation;
  readonly options?: CosmostationOptions;
  private eventMap: Map<
    string,
    Map<EventListenerOrEventListenerObject, Event>
  > = new Map();

  constructor(client: Cosmostation, options?: CosmostationOptions) {
    this.client = client;
    this.options = options;
  }

  get cosmos() {
    return this.client.cosmos;
  }

  get ikeplr() {
    return this.client.providers.keplr;
  }

  async enable(authRange: AuthRange, options?: unknown): Promise<void> {
    await Promise.all(
      Object.entries(authRange).map(async ([namespace, { chainIds }]) => {
        switch (namespace) {
          case 'aptos':
            await this.client.aptos.request({ method: 'aptos_connect' });
            return;
          case 'sui':
            await this.client.sui.request({ method: 'sui_connect' });
            return;
          default:
            return Promise.reject(`Unmatched namespace: ${namespace}.`);
        }
      })
    );
  }

  async disable(authRange: AuthRange, options?: unknown) {
    await Promise.all(
      Object.entries(authRange).map(async ([namespace, { chainIds }]) => {
        switch (namespace) {
          case 'cosmos':
            await this.client.cosmos.request({
              method: 'cos_disconnect',
            });
            return;
          default:
            return Promise.reject(`Unmatched namespace: ${namespace}.`);
        }
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
    options?: DocRelatedOptions
  ) {
    let _params: unknown = params;
    switch (method) {
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
    namespace: Namespace,
    params: SignParamsType,
    options?: SignOptionsMap
  ): Promise<AddRaw<SignResponse>> {
    const _options = options || this.options?.signOptions;
    const method = getMethod(discriminators.sign, namespace, params, _options);
    const resp = await this._request(namespace, method, params, _options);

    switch (method) {
      case 'cos_signMessage':
        const { pub_key, signature } = resp as SignResult.Cosmos.Message;
        return {
          publicKey: {
            value: pub_key.value,
            algo: pub_key.type,
          },
          signature: signature,
        };

      case 'cos_signAmino':
      case 'cos_signDirect':
        const {
          pub_key: docPubKey,
          signature: docSignature,
          signed_doc,
        } = resp as SignResult.Cosmos.Direct | SignResult.Cosmos.Amino;
        return {
          publicKey: {
            value: docPubKey.value,
            algo: docPubKey.type,
          },
          signature: docSignature,
          signedDoc: signed_doc,
        };

      case 'eth_sign':
      case 'eth_signTransaction':
      case 'eth_signTypedData_v3':
      case 'eth_signTypedData_v4':
      case 'aptos_signTransaction':
        return {
          signature: resp as
            | SignResult.Ethereum.Sign
            | SignResult.Ethereum.Transaction
            | SignResult.Ethereum.TypedDataV3
            | SignResult.Ethereum.TypedDataV4
            | SignResult.Aptos.Transaction,
        };

      case 'aptos_signMessage':
        const { signature: aptosSignature } = resp as SignResult.Aptos.Message;
        return {
          signature: aptosSignature,
          raw: resp,
        };

      default:
        return Promise.reject(`Unmatched method: ${method}.`);
    }
  }

  async verify(
    namespace: Namespace,
    params: VerifyParamsType,
    options?: VerifyOptionsMap
  ): Promise<boolean> {
    const _options = options || this.options?.verifyOptions;
    const method = getMethod(
      discriminators.verify,
      namespace,
      params,
      _options
    );
    const resp = await this._request(namespace, method, params, _options);

    switch (method) {
      case 'cos_verifyMessage':
        return resp as VerifyResult.Cosmos.Message;
      default:
        return Promise.reject(`Unmatched namespace: ${namespace}.`);
    }
  }

  async broadcast(
    namespace: Namespace,
    params: BroadcastParamsType,
    options?: BroadcastOptionsMap
  ): Promise<AddRaw<BroadcastResponse>> {
    const _options = options || this.options?.broadcastOptions;
    const method = getMethod(discriminators.sign, namespace, params, _options);
    const resp = await this._request(namespace, method, params, _options);

    switch (method) {
      case 'cos_sendTransaction':
        const {
          tx_response: { txhash, height, timestamp },
        } = resp as BroadcastResult.Cosmos.Transaction;
        return {
          block: {
            hash: txhash,
            height: height as string,
            timestamp: timestamp as string,
          },
          raw: resp,
        };

      default:
        return Promise.reject(`Unmatched namespace: ${namespace}.`);
    }
  }

  async signAndBroadcast(
    namespace: Namespace,
    params: SignAndBroadcastParamsType,
    options?: SignAndBroadcastOptionsMap
  ): Promise<AddRaw<BroadcastResponse>> {
    const _options = options || this.options?.signAndBroadcastOptions;
    const method = getMethod(discriminators.sign, namespace, params, _options);
    const resp = await this._request(namespace, method, params, _options);

    switch (method) {
      case 'aptos_signAndSubmitTransaction':
        const {
          hash,
          sequence_number,
        } = resp as SignAndBroadcastResult.Aptos.Transaction;
        return {
          block: { hash, height: sequence_number },
          raw: resp,
        };

      case 'sui_signAndExecuteTransaction':
        const { digest } = resp as SignAndBroadcastResult.Sui.Transaction;
        return {
          block: { hash: digest },
          raw: resp,
        };

      default:
        return Promise.reject(`Unmatched namespace: ${namespace}.`);
    }
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
