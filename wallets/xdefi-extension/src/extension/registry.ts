/// <reference types="../../types/global.d.ts" />
import logo from './logo.png';
import { Wallet } from '@cosmos-kit/core';

export const xdefiExtensionInfo: Wallet = {
  name: 'xdefi-extension',
  prettyName: 'XDEFI',
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
      link: 'https://chrome.google.com/webstore/detail/xdefi-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf',
    },
    {
      link: 'https://chrome.google.com/webstore/detail/xdefi-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf',
    },
  ],
};
