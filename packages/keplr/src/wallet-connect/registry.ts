import { Wallet } from '@cosmos-kit/core';

export const keplrMobileInfo: Wallet = {
  name: 'keplr-mobile',
  prettyName: 'Keplr Mobile',
  logo: 'https://user-images.githubusercontent.com/545047/191616515-eee176d0-9e50-4325-9529-6c0019d5c71a.png',
  isQRCode: true,
  connectEventNames: ['keplr_keystorechange'],
};
