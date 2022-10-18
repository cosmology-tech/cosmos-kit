import { Wallet } from '@cosmos-kit/core';
import { FaAndroid } from 'react-icons/fa';
import { GrFirefox } from 'react-icons/gr';
import { RiAppStoreFill, RiChromeFill } from 'react-icons/ri';

export const keplrExtensionInfo: Wallet = {
  name: 'keplr-extension',
  logo: 'https://pbs.twimg.com/profile_images/1498228570862219266/uctq7aeh_400x400.png',
  prettyName: 'Keplr Extension',
  isQRCode: false,
  desktopOnly: false,
  connectEventNames: ['keplr_keystorechange'],
  downloads: {
    desktop: [
      {
        browser: 'chrome',
        icon: RiChromeFill,
        link: 'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en',
      },
      {
        browser: 'firefox',
        icon: GrFirefox,
        link: 'https://addons.mozilla.org/en-US/firefox/addon/keplr/',
      },
    ],
    tablet: [
      {
        os: 'android',
        icon: FaAndroid,
        link: 'https://addons.mozilla.org/en-US/firefox/addon/keplr/',
      },
      {
        os: 'ios',
        icon: RiAppStoreFill,
        link: 'https://addons.mozilla.org/en-US/firefox/addon/keplr/',
      },
    ],
    mobile: [
      {
        os: 'android',
        icon: FaAndroid,
        link: 'https://addons.mozilla.org/en-US/firefox/addon/keplr/',
      },
      {
        os: 'ios',
        icon: RiAppStoreFill,
        link: 'https://addons.mozilla.org/en-US/firefox/addon/keplr/',
      },
    ],
    default: 'https://www.keplr.app/download',
  },
};
