import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignDoc,
} from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import { OS, WalletConnectClient } from '@cosmos-kit/core';
import WalletConnect from '@walletconnect/client';
import { IConnector } from '@walletconnect/types';
import { payloadId, saveMobileLinkInfo } from '@walletconnect/utils';

import { CosmostationAccount } from './types';

export class CosmostationClient implements WalletConnectClient {
  readonly connector: IConnector;

  constructor() {
    this.connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org',
    });
  }

  get qrUrl() {
    return this.connector.uri;
  }

  getAppUrl(os: OS) {
    switch (os) {
      case 'android':
        saveMobileLinkInfo({
          name: 'Cosmostation',
          href: 'intent://wc#Intent;package=wannabit.io.cosmostaion;scheme=cosmostation;end;',
        });
        return `intent://wc?${this.qrUrl}#Intent;package=wannabit.io.cosmostaion;scheme=cosmostation;end;`;
      case 'ios':
        saveMobileLinkInfo({
          name: 'Cosmostation',
          href: 'cosmostation://wc',
        });
        return `cosmostation://wc?${this.qrUrl}`;
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
        method: 'cosmostation_wc_accounts_v1',
        params: [chainId],
      })
    )[0] as CosmostationAccount;

    return {
      name: response.name,
      address: response.bech32Address,
      algo: response.algo as Algo,
      pubkey: response.pubKey,
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
    signDoc: StdSignDoc
  ): Promise<AminoSignResponse> {
    return (
      await this.connector.sendCustomRequest({
        id: payloadId(),
        jsonrpc: '2.0',
        method: 'cosmostation_wc_sign_tx_v1',
        params: [chainId, signer, signDoc],
      })
    )[0];
  }
}
