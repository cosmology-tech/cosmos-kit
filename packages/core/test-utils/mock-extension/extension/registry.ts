

import { Wallet } from '../../../src/types';
import { ICON } from '../constant';

export const mockExtensionInfo: Wallet = {
  name: 'mock-extension',
  prettyName: 'Mock',
  logo: ICON,
  mode: 'extension',
  mobileDisabled: () => true,
  rejectMessage: {
    source: 'Request rejected',
  },
  rejectCode: 404,
  connectEventNamesOnWindow: ['mock_keystorechange'],
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chrome.google.com/webstore/detail/mock-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
    },
    {
      link: 'https://chrome.google.com/webstore/detail/mock-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
    },
  ],
};
