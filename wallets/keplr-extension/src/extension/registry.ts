import { Wallet } from '@cosmos-kit/core';
import { GoDesktopDownload } from 'react-icons/go';
import { GrFirefox } from 'react-icons/gr';
import { RiChromeFill } from 'react-icons/ri';

export const keplrExtensionInfo: Wallet = {
  name: 'keplr-extension',
  logo: 'https://user-images.githubusercontent.com/545047/202085372-579be3f3-36e0-4e0b-b02f-48182af6e577.svg',
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
