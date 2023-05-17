import { Wallet } from '@cosmos-kit/core';

export const keplrExtensionInfo: Wallet = {
  name: 'keplr-extension',
  logo: 'https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/keplr.svg',
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
      link: 'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en',
    },
    {
      device: 'desktop',
      browser: 'firefox',
      link: 'https://addons.mozilla.org/en-US/firefox/addon/keplr/',
    },
    {
      link: 'https://www.keplr.app/download',
    },
  ],
};
