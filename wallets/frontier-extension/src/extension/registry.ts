import { Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const frontierExtensionInfo: Wallet = {
  name: 'frontier-extension',
  prettyName: 'Frontier',
  logo: ICON,
  mode: 'extension',
  mobileDisabled: true,
  rejectMessage: {
    source: 'Request rejected',
  },
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link:
        'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
    },
    {
      link:
        'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
    },
  ],
};
