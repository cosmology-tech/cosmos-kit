import { Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const metamaskCosmosSnapInfo: Wallet = {
  name: 'leap-metamask-cosmos-snap',
  description:
    'The Leap Cosmos MetaMask Snap allows signing of Cosmos transactions using MetaMask.',
  prettyName: 'Leap Cosmos MetaMask Snap',
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
