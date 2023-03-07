import { Algo } from '@cosmjs/amino';
import { Wallet, WalletAccount } from '@cosmos-kit/core';
import { WCAccount, WCClient } from '@cosmos-kit/walletconnect';

export class KeplrClient extends WCClient {
  constructor(walletInfo: Wallet) {
    super(walletInfo);
  }

  async getAccount(chainId: string): Promise<WalletAccount> {
    const { address, algo, pubkey } = (
      await this._getAccount(chainId)
    )[0] as WCAccount;
    return {
      address,
      algo: algo as Algo,
      pubkey: new Uint8Array(Buffer.from(pubkey, 'base64')),
    };
  }
}
