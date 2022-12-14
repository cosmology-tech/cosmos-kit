import { Wallet } from '@cosmos-kit/core';
import { GoDesktopDownload } from 'react-icons/go';
import { GrFirefox } from 'react-icons/gr';
import { RiChromeFill } from 'react-icons/ri';

export const omniExtensionInfo: Wallet = {
  name: 'omni-extension',
  logo:
    'https://pbs.twimg.com/profile_images/1498228570862219266/uctq7aeh_400x400.png',
  prettyName: 'Omni',
  mode: 'extension',
  mobileDisabled: true,
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: ['omni_keystorechange'],
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      icon: RiChromeFill,
      link:
        'https://chrome.google.com/webstore/detail/omni/dmkamcknogkgcdfhhbddcghachkejeap?hl=en',
    },
    {
      device: 'desktop',
      browser: 'firefox',
      icon: GrFirefox,
      link: 'https://addons.mozilla.org/en-US/firefox/addon/omni/',
    },
    {
      icon: GoDesktopDownload,
      link: 'https://www.omni.app/download',
    },
  ],
};
