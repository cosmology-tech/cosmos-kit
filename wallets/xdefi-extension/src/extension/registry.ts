import { Wallet } from '@cosmos-kit/core';

export const xdefiExtensionInfo: Wallet = {
  name: 'xdefi-extension',
  logo: 'https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/xdefi.png',
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
