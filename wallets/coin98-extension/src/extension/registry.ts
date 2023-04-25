import { Wallet } from '@cosmos-kit/core';

export const Coin98ExtensionInfo: Wallet = {
  name: 'coin98-extension',
  logo: 'https://coin98.s3.ap-southeast-1.amazonaws.com/logo_ex_wallet.png',
  prettyName: 'Coin98',
  mode: 'extension',
  //Enable for dapp browser
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chrome.google.com/webstore/detail/aeachknmefphepccionboohckonoeemg',
    },
    {
      link: 'https://coin98.com/wallet',
    },
  ],
};
