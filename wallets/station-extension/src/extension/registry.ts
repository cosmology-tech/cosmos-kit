import { Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const stationExtensionInfo: Wallet = {
  name: 'station-extension',
  prettyName: 'Station',
  logo: ICON,
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
      link:
        'https://chrome.google.com/webstore/detail/station-wallet/aiifbnbfobpmeekipheeijimdpnlpgpp',
    },
    {
      device: 'desktop',
      browser: 'firefox',
      link:
        'https://addons.mozilla.org/en-US/firefox/addon/terra-station-wallet/',
    },
  ],
};
