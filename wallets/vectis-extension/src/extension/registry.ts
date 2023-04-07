import { Wallet } from '@cosmos-kit/core';

export const vectisExtensionInfo: Wallet = {
  name: 'vectis-extension',
  logo:
    'https://raw.githubusercontent.com/nymlab/vectis-extension/51e5bd1addf16169159038616c784a2f3c163259/src/ui/public/assets/icons/vectis_128.png',
  prettyName: 'Vectis',
  mode: 'extension',
  mobileDisabled: true,
  rejectMessage:
    "The requested action couldn't be completed, it was rejected by the user.",
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
