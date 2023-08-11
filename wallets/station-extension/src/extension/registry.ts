import { Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const stationExtensionInfo: Wallet = {
  name: 'station-extension',
  prettyName: 'Station',
  logo: ICON,
  mode: 'extension',
  mobileDisabled: true,
  connectEventNamesOnWindow: [
    'station_wallet_change',
    'station_network_change',
  ],
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
    {
      device: 'desktop',
      browser: 'edge',
      link:
        'https://microsoftedge.microsoft.com/addons/detail/station-wallet/ajkhoeiiokighlmdnlakpjfoobnjinie',
    },
  ],
};
