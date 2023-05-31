import { Wallet } from '@cosmos-kit/core';

export const cosmostationExtensionInfo: Wallet = {
  name: 'cosmostation-extension',
  logo: 'https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/cosmostation.png',
  prettyName: 'Cosmostation',
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
