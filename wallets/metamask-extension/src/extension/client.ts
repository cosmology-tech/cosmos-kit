import {
  ChainRecord,
  DirectSignDoc,
  ExtendedHttpEndpoint,
  SignOptions,
  SignType,
  SimpleAccount,
  WalletAccount,
  WalletClient,
} from '@cosmos-kit/core';

export class MetamaskClient implements WalletClient {
  readonly client: any;

  constructor(client: any) {
    this.client = client;
  }

  async connect(chainIds?: string | string[]): Promise<void> {
    await this.client.request({ method: 'eth_requestAccounts' });
  }

  async enable(chainIds?: string | string[]) {
    await this.connect(chainIds);
  }

  async getSimpleAccount(chainId?: string): Promise<SimpleAccount> {
    const accounts: string[] = await this.client.request({
      method: 'eth_accounts',
    });
    if (accounts.length === 0) {
      return Promise.reject(
        "Not able to get accounts. Make sure you've connected MetaMask to this site."
      );
    }
    return {
      namespace: accounts[0].startsWith('0x') ? 'ethereum' : 'cosmos',
      address: accounts[0],
    };
  }

  // async getAccount(chainId?: string): Promise<WalletAccount> {
  //   const address = this.getAccount(chainId);
  //   const accounts: string[] = await this.client.request({
  //     method: 'eth_getEncryptionPublicKey',
  //     params: [address]
  //   });
  //   return {
  //     namespace: accounts[0].startsWith('0x') ? 'ethereum' : 'cosmos',
  //     address: accounts[0],
  //   };
  // }

  // protected async _signAmino(
  //   chainId: string,
  //   signer: string,
  //   signDoc: StdSignDoc,
  //   signOptions?: SignOptions
  // ) {
  //   const resp = this.client.sign({
  //     ...signDoc,
  //     sequence: Number(signDoc.sequence),
  //     msgs: signDoc.msgs as any,
  //     fee: void 0,
  //   });
  //   this.logger?.debug(`Response of cosmos_signAmino`, resp);
  //   return resp;
  // }

  // async signAmino(
  //   chainId: string,
  //   signer: string,
  //   signDoc: StdSignDoc,
  //   signOptions?: SignOptions
  // ): Promise<AminoSignResponse> {
  //   const result = (await this._signAmino(
  //     chainId,
  //     signer,
  //     signDoc,
  //     signOptions
  //   )) as AminoSignResponse;
  //   return result;
  // }
}
