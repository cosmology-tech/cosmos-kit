/// <reference types="../../types/global.d.ts" />
import logo from './logo.png';
import { Wallet } from '@cosmos-kit/core';

export const cosmostationExtensionInfo: Wallet = {
  name: 'cosmostation-extension',
  prettyName: 'Cosmostation',
  logo: logo,
  mode: 'extension',
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf?hl=en',
    },
    {
      link: 'https://cosmostation.io/wallet/#extension',
    },
  ],
  mobileDisabled: true,
  rejectMessage: {
    source:
      'The requested account and/or method has not been authorized by the user.',
    // target:
    //   'The requested account and/or method has not been authorized by the user. \n Open Extension/App to authorize this site before retrying.',
  },
  rejectCode: 4001,
  connectEventNamesOnWindow: ['cosmostation_keystorechange'],
};
