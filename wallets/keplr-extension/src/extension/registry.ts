import { Wallet } from '@cosmos-kit/core';
import { Window as KeplrWindow } from '@keplr-wallet/types';

import { ICON } from '../constant';

export const keplrExtensionInfo: Wallet = {
  name: 'keplr-extension',
  prettyName: 'Keplr',
  logo: ICON,
  mode: 'extension',
  // In the Keplr Mobile in-app browser, Keplr is available in window.keplr,
  // similar to the extension on a desktop browser. For this reason, we must
  // check what mode the window.keplr client is in once it's available.
  mobileDisabled: () =>
    !(
      typeof document !== 'undefined' &&
      document.readyState === 'complete' &&
      (window as KeplrWindow).keplr &&
      (window as KeplrWindow).keplr.mode === 'mobile-web'
    ),
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: ['keplr_keystorechange'],
  supportedChains: [
    'agoric',
    'akash',
    'archway',
    'axelar',
    'bostrom',
    'celestia',
    'certik',
    'comdex',
    'cosmoshub',
    'cryptoorgchain',
    'dymension',
    'emoney',
    'evmos',
    'gravitybridge',
    'injective',
    'irisnet',
    'ixo',
    'juno',
    'kava',
    'kujira',
    'noble',
    'nois',
    'osmosis',
    'persistence',
    'quicksilver',
    'regen',
    'secretnetwork',
    'sentinel',
    'sifchain',
    'sommelier',
    'stargaze',
    'starname',
    'stride',
    'terra2',
    'tgrade',
    'umee',
  ],
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
