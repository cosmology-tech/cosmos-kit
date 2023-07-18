import { Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const cosmostationExtensionInfo: Wallet = {
  name: 'cosmostation-extension',
  prettyName: 'Cosmostation',
  logo: ICON,
  mode: 'extension',
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link:
        'https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf?hl=en',
    },
    {
      link: 'https://cosmostation.io/wallet/#extension',
    },
  ],
  mobileDisabled: () => !('cosmostation' in window || /Cosmostation/i.test(navigator.userAgent)),
  rejectMessage: {
    source:
      'The requested account and/or method has not been authorized by the user.',
    // target:
    //   'The requested account and/or method has not been authorized by the user. \n Open Extension/App to authorize this site before retrying.',
  },
  rejectCode: 4001,
  connectEventNamesOnWindow: ['cosmostation_keystorechange'],
};
