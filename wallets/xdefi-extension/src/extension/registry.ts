import { Wallet } from '@cosmos-kit/core';

export const xdefiExtensionInfo: Wallet = {
  name: 'xdefi-extension',
  logo: 'https://user-images.githubusercontent.com/25910069/212674085-97c92e14-6f59-4ac8-b909-ebdeab5d2127.png',
  prettyName: 'XDEFI',
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
