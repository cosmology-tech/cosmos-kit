import { Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const cdcwalletExtensionInfo: Wallet = {
  name: 'cdcwallet-extension',
  prettyName: 'Crypto.com Wallet',
  logo: ICON,
  mode: 'extension',
  mobileDisabled: () => false,
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: ['cdcwallet_keystorechange'],
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chromewebstore.google.com/detail/cryptocom-wallet-extensio/hifafgmccdpekplomjjkcfgodnhcellj',
    },
    {
      device: 'mobile',
      os: 'android',
      link: 'https://wallet.crypto.com/deeplink',
    },
    {
      device: 'mobile',
      os: 'ios',
      link: 'https://wallet.crypto.com/deeplink',
    },
    {
      link: 'https://wallet.crypto.com/deeplink',
    },
  ],
};
