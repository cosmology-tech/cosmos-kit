import { Wallet } from '@cosmos-kit/core';

export const Coin98ExtensionInfo: Wallet = {
  name: 'coin98-extension',
  logo: 'https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/coin98.png',
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
