/* eslint-disable no-console */
import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignDoc,
} from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import { OS, SignOptions } from '@cosmos-kit/core';
import { IWCClientV1 } from '@cosmos-kit/walletconnect-v1';
import { KeplrIntereactionOptions } from '@keplr-wallet/types';
import WalletConnect from '@walletconnect/client';
import { IConnector } from '@walletconnect/types-v1';
import { payloadId, saveMobileLinkInfo } from '@walletconnect/utils';
import deepmerge from 'deepmerge';

import { KeplrAccount } from './types';

export class KeplrClient implements IWCClientV1 {
  defaultOptions: KeplrIntereactionOptions = {};
  readonly connector: IConnector;

  constructor() {
    this.connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org',
      signingMethods: [
        'keplr_enable_wallet_connect_v1',
        'keplr_get_key_wallet_connect_v1',
        'keplr_sign_amino_wallet_connect_v1',
      ],
    });
  }

  get qrUrl() {
    return this.connector.uri;
  }

  getAppUrl(os?: OS) {
    switch (os) {
      case 'android':
        saveMobileLinkInfo({
          name: 'Keplr',
          href:
            'intent://wcV1#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;',
        });
        return `intent://wcV1?${this.qrUrl}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;`;
      case 'ios':
        saveMobileLinkInfo({
          name: 'Keplr',
          href: 'keplrwallet://wcV1',
        });
        return `keplrwallet://wcV1?${this.qrUrl}`;
      default:
        return void 0;
    }
  }

  async enable(chainIds: string | string[]) {
    if (typeof chainIds === 'string') {
      chainIds = [chainIds];
    }

    await this.connector.sendCustomRequest({
      id: payloadId(),
      jsonrpc: '2.0',
      method: 'keplr_enable_wallet_connect_v1',
      params: chainIds,
    });
  }

  async getAccount(chainId: string) {
    const response = (
      await this.connector.sendCustomRequest({
        id: payloadId(),
        jsonrpc: '2.0',
        method: 'keplr_get_key_wallet_connect_v1',
        params: [chainId],
      })
    )[0] as KeplrAccount;

    return {
      name: response.name,
      address: response.bech32Address,
      algo: response.algo as Algo,
      pubkey: Buffer.from(response.pubKey, 'hex'),
    };
  }

  getOfflineSigner(chainId: string): OfflineAminoSigner {
    return {
      getAccounts: async () => {
        return [await this.getAccount(chainId)];
      },
      signAmino: (signerAddress: string, signDoc: StdSignDoc) =>
        this.signAmino(chainId, signerAddress, signDoc),
    } as OfflineAminoSigner;
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions: SignOptions = {}
  ): Promise<AminoSignResponse> {
    return (
      await this.connector.sendCustomRequest({
        id: payloadId(),
        jsonrpc: '2.0',
        method: 'keplr_sign_amino_wallet_connect_v1',
        params: [
          chainId,
          signer,
          signDoc,
          deepmerge(this.defaultOptions.sign ?? {}, signOptions),
        ],
      })
    )[0];
  }
}
