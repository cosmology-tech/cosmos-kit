import { Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const compassExtensionInfo: Wallet = {
  name: 'compass-extension',
  prettyName: 'Compass',
  logo: ICON,
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
