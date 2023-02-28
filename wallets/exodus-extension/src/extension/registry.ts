import { Wallet } from '@cosmos-kit/core';
import { GoDesktopDownload } from 'react-icons/go';
import { RiChromeFill } from 'react-icons/ri';

import { EXODUS_ICON } from '../constants';

export const exodusExtensionInfo: Wallet = {
  name: 'exodus-extension',
  logo: EXODUS_ICON,
  prettyName: 'Exodus',
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
