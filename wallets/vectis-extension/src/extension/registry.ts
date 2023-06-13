import logo from './logo.png';
import { Wallet } from '@cosmos-kit/core';

export const vectisExtensionInfo: Wallet = {
  name: 'vectis-extension',
  prettyName: 'Vectis',
  logo: logo,
  mode: 'extension',
  mobileDisabled: true,
  rejectMessage: {
    source:
      "The requested action couldn't be completed, it was rejected by the user.",
  },
  connectEventNamesOnWindow: ['vectis_accountChanged'],
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link:
        'https://chrome.google.com/webstore/detail/vectis-wallet/cgkaddoglojnmfiblgmlinfaijcdpfjm',
    },
  ],
};
