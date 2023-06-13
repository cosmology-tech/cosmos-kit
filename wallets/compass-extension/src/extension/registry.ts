import logo from './logo.png';
import { Wallet } from '@cosmos-kit/core';

export const compassExtensionInfo: Wallet = {
  name: 'compass-extension',
  prettyName: 'Compass',
  logo: logo,
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
