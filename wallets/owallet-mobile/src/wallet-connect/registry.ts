import { OS, Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const owalletMobileInfo: Wallet = {
  name: 'owallet-mobile',
  prettyName: 'OWallet Mobile',
  logo: ICON,
  mode: 'wallet-connect',
  // mobileDisabled: () =>
  //   'owallet' in window && /OWalletMobile/i.test(navigator.userAgent),
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  downloads: [
    {
      device: 'mobile',
      os: 'android',
      link: 'https://play.google.com/store/apps/details?id=com.io.owallet',
    },
    {
      device: 'mobile',
      os: 'ios',
      link: 'https://apps.apple.com/app/owallet/id1626035069',
    },
    {
      link: 'https://owallet.io/',
    },
  ],
  connectEventNamesOnWindow: ['keplr_keystorechange'],

  walletconnect: {
    name: 'OWallet Mobile',
    projectId:
      '3ed8cc046c6211a798dc5ec70f1302b43e07db9639fd287de44a9aa115a21ed6',
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
          const linkAndroid = `intent://wcV2?${encodedWcUrl}#Intent;package=com.io.owallet;scheme=owallet;end;`;
          alert(linkAndroid);
          return linkAndroid;
        default:
          return `${plainAppUrl}://wcV2?${encodedWcUrl}`;
      }
    },
  },
};
