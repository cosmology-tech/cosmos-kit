/// <reference types="../../types/global.d.ts" />
import logo from './logo.png'
import { Wallet } from '@cosmos-kit/core';

export const frontierExtensionInfo: Wallet = {
  name: 'frontier-extension',
  prettyName: 'Frontier',
  logo: logo,
  mode: 'extension',
  mobileDisabled: true,
  rejectMessage: {
    source: 'Request rejected',
  },
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
    },
    {
      link: 'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
    },
  ],
};
