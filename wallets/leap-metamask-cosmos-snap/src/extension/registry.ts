import { Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const metamaskCosmosSnapInfo: Wallet = {
  name: 'leap-metamask-cosmos-snap',
  description:
    'The Leap MetaMask Cosmos Snap allows signing of Cosmos transactions using MetaMask.',
  prettyName: 'Leap Metamask Cosmos Snap',
  logo: ICON,
  mode: 'extension',
  metamask_snap: true,
  mobileDisabled: () => !('ethereum' in window),
  rejectMessage: {
    source: 'Request rejected',
  },
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link:
        'https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk',
    },
    {
      link:
        'https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk',
    },
  ],
};
