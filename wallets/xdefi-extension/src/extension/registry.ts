import { Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const xdefiExtensionInfo: Wallet = {
  name: 'xdefi-extension',
  prettyName: 'XDEFI',
  logo: ICON,
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
