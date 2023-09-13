import { Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const cosmosSnapExtensionInfo: Wallet = {
  name: 'cosmos-extension-metamask',
  description:
    'The Official Cosmos Extension for MetaMask allowing full use of MetaMask within the Cosmos.',
  prettyName: 'Cosmos MetaMask Extension',
  logo: ICON,
  mode: 'extension',
  extends: 'MetaMask',
  mobileDisabled: () => !('ethereum' in window),
  rejectMessage: {
    source: 'Request rejected',
  },
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    },
    {
      link:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    },
  ],
};
