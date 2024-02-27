import { OS, Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const owalletMobileInfo: Wallet = {
  name: 'owallet-mobile',
  prettyName: 'Owallet Mobile',
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
      link: 'https://play.google.com/store/apps/details?id=com.io.owallet&hl=en&gl=US&pli=1',
    },
    {
      device: 'mobile',
      os: 'ios',
      link: 'https://apps.apple.com/us/app/owallet/id1626035069',
    },
    {
      link: 'https://owallet.dev',
    },
  ],
  connectEventNamesOnWindow: ['keplr_keystorechange'],
  walletconnect: {
    name: 'Owallet',
    projectId:
      '6adb6082c909901b9e7189af3a4a0223102cd6f8d5c39e39f3d49acb92b578bb',
    encoding: 'base64',
    mobile: {
      native: {
        ios: 'owallet:',
        android: 'intent:',
      },
    },
    formatNativeUrl: (
      appUrl: string,
      wcUri: string,
      os: OS | undefined,
      _name: string
    ): string => {
      const plainAppUrl = appUrl.split(':')[0];
      const encodedWcUrl = encodeURIComponent(wcUri);
      switch (os) {
        case 'ios':
          return `${plainAppUrl}://wcV2?${encodedWcUrl}`;
        case 'android':
          return `intent://wcV2?${encodedWcUrl}#Intent;package=com.io.owallet;scheme=owallet;end;`;
        default:
          return `${plainAppUrl}://wcV2?${encodedWcUrl}`;
      }
    },
  },
};
