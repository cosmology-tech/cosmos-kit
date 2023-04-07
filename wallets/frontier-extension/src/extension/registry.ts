import { Wallet } from '@cosmos-kit/core';

export const frontierExtensionInfo: Wallet = {
  name: 'frontier-extension',
  logo: 'https://www.frontier.xyz/assets/images/frontier.png',
  prettyName: 'Frontier',
  mode: 'extension',
  mobileDisabled: true,
  rejectMessage: 'Request rejected',
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
