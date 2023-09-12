import { Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const OkxwalletExtensionInfo: Wallet = {
  name: 'okxwallet-extension',
  prettyName: 'OKX Wallet',
  logo: ICON,
  mode: 'extension',
  mobileDisabled: true,
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: ['okxwallet_keystorechange'],
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
    },
    {
      device: 'desktop',
      browser: 'firefox',
      link: 'https://addons.mozilla.org/zh-CN/firefox/addon/okexwallet/',
    },
    {
      link: 'https://www.okx.com/download',
    },
  ],
};
