import { Wallet } from '@cosmos-kit/core';
import { WCClientV2 } from '@cosmos-kit/walletconnect-v2';

export class OmniClient extends WCClientV2 {
  constructor(walletInfo: Wallet, projectId: string) {
    super(walletInfo, projectId);
  }
}
