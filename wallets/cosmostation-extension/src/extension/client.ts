import { StdSignDoc } from '@cosmjs/amino';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import {
  Algo,
  BroadcastMode,
  ChainRecord,
  DirectSignDoc,
  EncodedString,
  ExtendedHttpEndpoint,
  getStringFromUint8Array,
  Namespace,
  Signature,
  SignType,
  WalletAccount,
  WalletClient,
} from '@cosmos-kit/core';
import { CosmosWalletAccount, isDirectDoc } from '@cosmos-kit/cosmos';
import {
  AddChainParams,
  SignAminoResponse,
  SignDirectResponse,
  SignMessageResponse,
  SignOptions,
  VerifyMessageResponse,
} from '@cosmostation/extension-client/types/message';

import { Cosmostation, WalletAddEthereumChainParam } from './types';

export class CosmostationClient implements WalletClient {
  readonly client: Cosmostation;
  private eventMap: Map<
    string,
    Map<EventListenerOrEventListenerObject, Event>
  > = new Map();

  constructor(client: Cosmostation) {
    this.client = client;
  }

  get cosmos() {
    return this.client.cosmos;
  }

  get ikeplr() {
    return this.client.providers.keplr;
  }

  async connect(namespace: Namespace, chainIds?: string[]): Promise<void> {
    switch (namespace) {
      case 'aptos':
        await this.client.aptos.request({ method: 'aptos_connect' });
        return;
      case 'sui':
        await this.client.sui.request({ method: 'sui_connect' });
        return;
      default:
        return;
    }
  }

  async addChain(namespace: Namespace, chainInfo: unknown): Promise<void> {
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
        return Promise.reject('Unmatched namespace.');
    }
  }

  switchChain(namespace: Namespace, chainId: string): Promise<void> {
    switch (namespace) {
      case 'ethereum':
        this.client.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
        return;
      default:
        return Promise.reject('Unmatched namespace.');
    }
  }

  async getAccounts(namespace: Namespace, chainIds?: string[]) {
    switch (namespace) {
      case 'cosmos':
        if (!chainIds) {
          return Promise.reject('No chainId provided.');
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
              },
              algo: key.algo,
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
          method: 'sui_getAccounts',
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
        return Promise.reject('Unmatched namespace.');
    }
  }

  async sign(
    namespace: Namespace,
    signerAddress: string,
    doc: unknown,
    chainId?: string,
    options?: SignOptions
  ): Promise<Signature> {
    switch (namespace) {
      case 'cosmos':
        if (!chainId) {
          return Promise.reject('ChainId not provided.');
        }
        if (typeof doc === 'string') {
          const { pub_key, signature } = (await this.client.cosmos.request({
            method: 'cos_signMessage',
            params: {
              chainName: chainId,
              signer: signerAddress,
              message: doc,
            },
          })) as SignMessageResponse;
          return {
            publicKey: pub_key,
            signature: {
              value: signature,
            },
            signedDoc: doc,
          };
        } else {
          const {
            pub_key,
            signature,
            signed_doc,
          } = (await this.client.cosmos.request({
            method: isDirectDoc(doc) ? 'cos_signDirect' : 'cos_signAmino',
            params: {
              chainName: chainId,
              doc: doc,
              isEditMemo: !!(options === null || options === void 0
                ? void 0
                : options.memo),
              isEditFee: !!(options === null || options === void 0
                ? void 0
                : options.fee),
              gasRate:
                options === null || options === void 0
                  ? void 0
                  : options.gasRate,
            },
          })) as SignDirectResponse | SignAminoResponse;
          return {
            publicKey: pub_key,
            signature: {
              value: signature,
            },
            signedDoc: signed_doc,
          };
        }
      case 'ethereum':
        if (typeof doc === 'string') {
          const { result } = (await this.client.ethereum.request({
            method: 'eth_sign',
            params: [signerAddress, doc],
          })) as { result: string };
          return {
            signature: {
              value: result,
            },
            signedDoc: doc,
          };
        } else {
        }
        const signature = (await this.client.ethereum.request({
          method: 'eth_signTypedData_v4',
          params: [signerAddress, doc],
        })) as string;
        return {
          signature: {
            value: signature,
          },
          signedDoc: doc,
        };
      default:
        break;
    }
  }

  async verify(
    namespace: Namespace,
    signerAddress: string,
    doc: unknown,
    signature: Signature,
    chainId?: string
  ): Promise<boolean> {
    switch (namespace) {
      case 'cosmos':
        if (!chainId) {
          return Promise.reject('ChainId not provided.');
        }
        if (typeof doc === 'string') {
          const result = (await this.client.cosmos.request({
            method: 'cos_verifyMessage',
            params: {
              chainName: chainId,
              signer: signerAddress,
              message: doc,
              publicKey: signature.publicKey.value,
              signature: signature.signature.value,
            },
          })) as VerifyMessageResponse;
          return result;
        }
        return Promise.reject('Only support message string verification.');
      default:
        return Promise.reject('Unmatched namespace.');
    }
  }

  async disconnect(chainIds?: string[]) {
    await this.cosmos.request({
      method: 'cos_disconnect',
    });
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

  getOfflineSigner(chainId: string, preferredSignType?: SignType) {
    switch (preferredSignType) {
      case 'amino':
        return this.getOfflineSignerAmino(chainId);
      case 'direct':
        return this.getOfflineSignerDirect(chainId);
      default:
        return this.getOfflineSignerAmino(chainId);
    }
    // return this.ikeplr.getOfflineSignerAuto(chainId);
  }

  getOfflineSignerAmino(chainId: string) {
    return this.ikeplr.getOfflineSignerOnlyAmino(chainId);
  }

  getOfflineSignerDirect(chainId: string) {
    return this.ikeplr.getOfflineSigner(chainId) as OfflineDirectSigner;
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ) {
    try {
      return await this.ikeplr.signAmino(chainId, signer, signDoc, signOptions);
    } catch (error) {
      return await this.cosmos.request({
        method: 'cos_signAmino',
        params: {
          chainName: chainId,
          doc: signDoc,
          isEditMemo: signOptions?.preferNoSetMemo,
          isEditFee: signOptions?.preferNoSetFee,
        },
      });
    }
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ) {
    try {
      return await this.ikeplr.signDirect(
        chainId,
        signer,
        signDoc,
        signOptions
      );
    } catch (error) {
      return await this.cosmos.request({
        method: 'cos_signDirect',
        params: {
          chainName: chainId,
          doc: signDoc,
          isEditMemo: signOptions?.preferNoSetMemo,
          isEditFee: signOptions?.preferNoSetFee,
        },
      });
    }
  }

  async sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode) {
    return await this.ikeplr.sendTx(chainId, tx, mode);
  }
}
