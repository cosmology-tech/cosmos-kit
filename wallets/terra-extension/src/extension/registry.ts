import { Wallet } from '@cosmos-kit/core';
import { GoDesktopDownload } from 'react-icons/go';
import { RiChromeFill } from 'react-icons/ri';
import { GrFirefox } from 'react-icons/gr';

export const terraExtensionInfo: Wallet = {
  name: 'terra-extension',
  logo: 'https://assets.terra.money/icon/station-extension/icon.png',
  prettyName: 'Terra Station',
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
      link: 'https://chrome.google.com/webstore/detail/station-wallet/aiifbnbfobpmeekipheeijimdpnlpgpp',
    },
    {
      device: 'desktop',
      browser: 'firefox',
      icon: GrFirefox,
      link: 'https://addons.mozilla.org/en-US/firefox/addon/terra-station-wallet/',
    },
  ],
};
