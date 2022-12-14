/* eslint-disable no-console */
import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignDoc,
} from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import { OS, SignOptions, WalletConnectClientV2 } from '@cosmos-kit/core';
import { CoreTypes } from '@walletconnect/types';
import { payloadId, saveMobileLinkInfo } from '@walletconnect/utils';
import deepmerge from 'deepmerge';

import { OmniAccount } from './types';

export class OmniClient extends WalletConnectClientV2 {
  constructor(projectId: string, metaData?: CoreTypes.Metadata) {
    super(projectId, metaData);
  }

  get qrUrl() {
    return this.connector.uri;
  }

  getAppUrl(os?: OS) {
    switch (os) {
      case 'android':
        saveMobileLinkInfo({
          name: 'Omni',
          href:
            'intent://wcV1#Intent;package=com.chainapsis.omni;scheme=omniwallet;end;',
        });
        return `intent://wcV1?${this.qrUrl}#Intent;package=com.chainapsis.omni;scheme=omniwallet;end;`;
      case 'ios':
        saveMobileLinkInfo({
          name: 'Omni',
          href: 'omniwallet://wcV1',
        });
        return `omniwallet://wcV1?${this.qrUrl}`;
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
      method: 'omni_enable_wallet_connect_v1',
      params: chainIds,
    });
  }

  async getAccount(chainId: string) {
    const response = (
      await this.connector.sendCustomRequest({
        id: payloadId(),
        jsonrpc: '2.0',
        method: 'omni_get_key_wallet_connect_v1',
        params: [chainId],
      })
    )[0] as OmniAccount;

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
        method: 'omni_sign_amino_wallet_connect_v1',
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
