import { Wallet } from '@cosmos-kit/core';

export const compassExtensionInfo: Wallet = {
  name: 'compass-extension',
  logo: 'https://assets.leapwallet.io/logos/compass.png',
  prettyName: 'Compass',
  mode: 'extension',
  mobileDisabled: true,
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: ['compass_keystorechange'],
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link:
        'https://chrome.google.com/webstore/detail/compass-wallet/anokgmphncpekkhclmingpimjmcooifb',
    },
    {
      link:
        'https://chrome.google.com/webstore/detail/compass-wallet/anokgmphncpekkhclmingpimjmcooifb',
    },
  ],
};
