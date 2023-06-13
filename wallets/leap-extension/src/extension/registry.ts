/// <reference types="../../types/global.d.ts" />
import logo from './logo.svg';
import { Wallet } from '@cosmos-kit/core';

export const leapExtensionInfo: Wallet = {
  name: 'leap-extension',
  prettyName: 'Leap',
  logo: logo,
  mode: 'extension',
  mobileDisabled: true,
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
