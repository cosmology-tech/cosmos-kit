import { Wallet } from '@cosmos-kit/core';

export const stationExtensionInfo: Wallet = {
  name: 'station-extension',
  logo: 'https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/ed7ca96549265c47cd7ad1936a49b5d58113823c/public/images/logos/wallets/station.svg',
  prettyName: 'Station',
  mode: 'extension',
  mobileDisabled: true,
  connectEventNamesOnWindow: [],
  rejectMessage: {
    source: 'Request rejected',
  },
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chrome.google.com/webstore/detail/station-wallet/aiifbnbfobpmeekipheeijimdpnlpgpp',
    },
    {
      device: 'desktop',
      browser: 'firefox',
      link: 'https://addons.mozilla.org/en-US/firefox/addon/terra-station-wallet/',
    },
  ],
};
