import { Wallet } from '@cosmos-kit/core';

export const vectisExtensionInfo: Wallet = {
  name: 'vectis-extension',
  logo:
    // 'https://cloudflare-ipfs.com/ipfs/QmU7BdRsm936vQvawJNzxfHEuChEf8GEKUhp4ADHjV6tnp',
    'https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/vectis.png',
  prettyName: 'Vectis',
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
