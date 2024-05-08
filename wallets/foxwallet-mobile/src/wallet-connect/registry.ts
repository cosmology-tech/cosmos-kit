import { Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const foxwalletMobileInfo: Wallet = {
  name: 'foxwallet-mobile',
  prettyName: 'FoxWallet Mobile',
  logo: ICON,
  mode: 'wallet-connect',
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  downloads: [
    {
      device: 'mobile',
      os: 'android',
      link: 'https://play.google.com/store/apps/details?id=com.foxwallet.play&pli=1',
    },
    {
      device: 'mobile',
      os: 'ios',
      link: 'https://apps.apple.com/us/app/foxwallet-secure-crypto-asset/id1590983231',
    },
    {
      link: 'https://foxwallet.com/download',
    },
  ],
  connectEventNamesOnWindow: ['foxwallet_keystorechange'],
  walletconnect: {
    name: 'FoxWallet',
    projectId: '2454f2162960c7c9fc12dace22e2137e',
  },
};
