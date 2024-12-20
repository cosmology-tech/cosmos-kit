import { Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const ctrlExtensionInfo: Wallet = {
  name: 'ctrl-extension',
  prettyName: 'CTRL',
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
      link: 'https://chromewebstore.google.com/detail/ctrl-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf',
    },
    {
      link: 'https://chromewebstore.google.com/detail/ctrl-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf',
    },
  ],
};
