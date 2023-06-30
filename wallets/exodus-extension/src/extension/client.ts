import { BroadcastMode, DirectSignDoc, WalletClient } from '@cosmos-kit/core';

import type {
  AccountData,
  DirectSignResponse,
  ExodusCosmosProvider,
  StdSignDoc,
} from '../types';

export class ExodusClient implements WalletClient {
  readonly client: ExodusCosmosProvider;

  constructor(client: ExodusCosmosProvider) {
    this.client = client;
  }

  async connect(chainId: string | string[]) {
    await this.client.connect({
      chainId: Array.isArray(chainId) ? chainId[0] : chainId,
    });
  }

  async getSimpleAccount(chainId: string) {
    const { address } = await this.getAccount(chainId);
    return {
      namespace: 'cosmos',
      chainId,
      address,
    };
  }

  async getAccount(chainId: string) {
    const response = await this.client.connect({ chainId });

    return {
      ...response,
      pubkey: response.publicKey,
    };
  }

  async getOfflineSigner(chainId: string) {
    return {
      getAccounts: async (): Promise<AccountData[]> => [
        await this.getAccount(chainId),
      ],
      signDirect: async (
        signer: string,
        signDoc: DirectSignDoc
      ): Promise<DirectSignResponse> => {
        return this.client.signTransaction(signDoc);
      },
    };
  }

  async signAmino(chainId: string, signer: string, signDoc: StdSignDoc) {
    return this.client.signAminoTransaction(signDoc);
  }

  async sendTx(chainId: string, transaction: Uint8Array, mode: BroadcastMode) {
    return this.client.sendTx(chainId, transaction, mode);
  }
}
