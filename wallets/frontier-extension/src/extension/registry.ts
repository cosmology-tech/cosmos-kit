import { Wallet } from '@cosmos-kit/core';
import { GoDesktopDownload } from 'react-icons/go';
import { RiChromeFill } from 'react-icons/ri';

export const frontierExtensionInfo: Wallet = {
  name: 'frontier-extension',
  logo: 'https://www.frontier.xyz/assets/images/frontier.png',
  prettyName: 'Frontier',
  mode: 'extension',
  mobileDisabled: true,
  rejectMessage: {
    source: 'Request rejected',
  },
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      icon: RiChromeFill,
      link:
        'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
    },
    {
      icon: GoDesktopDownload,
      link:
        'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
    },
  ],
};
