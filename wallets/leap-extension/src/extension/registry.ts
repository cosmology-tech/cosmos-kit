import { Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const leapExtensionInfo: Wallet = {
  name: 'leap-extension',
  prettyName: 'Leap',
  logo: ICON,
  mode: 'extension',
  mobileDisabled: () =>
    !('leap' in window || /LeapCosmos/i.test(navigator.userAgent)),
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: ['leap_keystorechange'],
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
    },
    {
      link: 'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
    },
  ],
};
