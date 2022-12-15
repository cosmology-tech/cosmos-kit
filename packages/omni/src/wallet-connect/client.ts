import { WCClientV2 } from '@cosmos-kit/walletconnect-v2';
import SignClient from '@walletconnect/sign-client';

export class OmniClient extends WCClientV2 {
  constructor(signClient: SignClient) {
    super(signClient);
  }
}
