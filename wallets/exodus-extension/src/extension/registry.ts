import { Wallet } from '@cosmos-kit/core';
import { GoDesktopDownload } from 'react-icons/go';
import { RiChromeFill } from 'react-icons/ri';

import { ICON } from '../constant';

export const exodusExtensionInfo: Wallet = {
  name: 'exodus-extension',
  prettyName: 'Exodus',
  logo: ICON,
  mode: 'extension',
  mobileDisabled: true,
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: ['exodus_keystorechange'],
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      icon: RiChromeFill,
      link:
        'https://chrome.google.com/webstore/detail/exodus-web3-wallet/aholpfdialjgjfhomihkjbmgjidlcdno',
    },
    {
      icon: GoDesktopDownload,
      link: 'https://www.exodus.com/download',
    },
  ],
};
