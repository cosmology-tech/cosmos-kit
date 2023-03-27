import { Wallet } from '@cosmos-kit/core';

export const terrastationExtensionInfo: Wallet = {
  name: 'terrastation-extension',
  logo: 'https://assets.terra.money/icon/wallet-provider/station.svg',
  prettyName: 'Terra Station',
  mode: 'extension',
  mobileDisabled: true,
  connectEventNamesOnWindow: [],
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
