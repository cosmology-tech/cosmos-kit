import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignDoc,
} from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import { OS } from '@cosmos-kit/core';
import { IWCClientV1 } from '@cosmos-kit/walletconnect-v1';
import WalletConnect from '@walletconnect/client';
import { IConnector } from '@walletconnect/types-v1';
import { payloadId, saveMobileLinkInfo } from '@walletconnect/utils';

import { CosmostationAccount } from './types';

export class CosmostationClient implements IWCClientV1 {
  readonly connector: IConnector;

  constructor() {
    this.connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org',
      signingMethods: [
        'cosmostation_wc_accounts_v1',
        'cosmostation_wc_sign_tx_v1',
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
          name: 'Cosmostation',
          href:
            'intent://wc#Intent;package=wannabit.io.cosmostaion;scheme=cosmostation;end;',
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

  async getAccount(chainId: string) {
    const result = (
      await this.connector.sendCustomRequest({
        id: payloadId(),
        jsonrpc: '2.0',
        method: 'cosmostation_wc_accounts_v1',
        params: [chainId],
      })
    )[0] as CosmostationAccount;

    return {
      name: result.name,
      address: result.bech32Address,
      algo: result.algo as Algo,
      pubkey: result.pubKey,
      isNanoLedger: result.isNanoLedger,
    };
  }

  getOfflineSignerAmino(chainId: string) {
    return {
      getAccounts: async () => {
        return [await this.getAccount(chainId)];
      },
      signAmino: (signerAddress: string, signDoc: StdSignDoc) =>
        this.signAmino(chainId, signerAddress, signDoc),
    } as OfflineAminoSigner;
  }

  async getOfflineSigner(chainId: string) {
    return this.getOfflineSignerAmino(chainId);
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
