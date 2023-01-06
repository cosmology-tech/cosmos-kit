import { Wallet } from '@cosmos-kit/core';
import { GoDesktopDownload } from 'react-icons/go';
import { GrFirefox } from 'react-icons/gr';
import { RiChromeFill } from 'react-icons/ri';

export const keplrExtensionInfo: Wallet = {
  name: 'keplr-extension',
  logo: 'https://pbs.twimg.com/profile_images/1498228570862219266/uctq7aeh_400x400.png',
  prettyName: 'Keplr',
  mode: 'extension',
  mobileDisabled: true,
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: ['keplr_keystorechange'],
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      icon: RiChromeFill,
      link: 'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en',
    },
    {
      device: 'desktop',
      browser: 'firefox',
      icon: GrFirefox,
      link: 'https://addons.mozilla.org/en-US/firefox/addon/keplr/',
    },
    {
      icon: GoDesktopDownload,
      link: 'https://www.keplr.app/download',
    },
  ],
};
