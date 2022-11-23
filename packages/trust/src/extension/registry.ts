import { Wallet } from '@cosmos-kit/core';
import { GoDesktopDownload } from 'react-icons/go';
import { RiChromeFill } from 'react-icons/ri';

export const trustExtensionInfo: Wallet = {
  name: 'trust-extension',
  logo: 'https://trustwallet.com/assets/images/media/assets/TWT.png',
  prettyName: 'Trust',
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
      link: 'https://chrome.google.com/webstore/detail/trust-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
    },
    {
      icon: GoDesktopDownload,
      link: 'https://chrome.google.com/webstore/detail/trust-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
    },
  ],
};
