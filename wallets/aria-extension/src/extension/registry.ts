import { Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const ariaExtensionInfo: Wallet = {
  name: 'aria-extension',
  prettyName: 'Aria',
  logo: ICON,
  mode: 'extension',
  mobileDisabled: () =>
    !('aria' in window || /AriaCosmos/i.test(navigator.userAgent)),
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: ['aria_keystorechange'],
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chrome.google.com/webstore/detail/aria-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
    },
    {
      link: 'https://chrome.google.com/webstore/detail/aria-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
    },
  ],
};
