import { Wallet } from '@cosmos-kit/core';

export const MetamaskCosmosSnapInfo: Wallet = {
  name: 'leap-metamask-cosmos-snap',
  prettyName: 'Leap Metamask Cosmos Snap',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
  mode: 'extension',
  mobileDisabled: true,
  rejectMessage: {
    source: 'Request rejected',
  },
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk',
    },
  ],
};
