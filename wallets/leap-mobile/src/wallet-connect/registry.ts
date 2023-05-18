import { OS, Wallet } from '@cosmos-kit/core';
import { FaAndroid } from 'react-icons/fa';
import { GoDesktopDownload } from 'react-icons/go';
import { RiAppStoreFill } from 'react-icons/ri';

export const LeapMobileInfo: Wallet = {
  name: 'leap-cosmos-mobile',
  prettyName: 'Leap Mobile',
  logo: 'https://assets.leapwallet.io/logos/leap-cosmos-logo.png',
  mode: 'wallet-connect',
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  downloads: [
    {
      device: 'mobile',
      os: 'android',
      icon: FaAndroid,
      link:
        'https://play.google.com/store/apps/details?id=io.leapwallet.cosmos',
    },
    {
      device: 'mobile',
      os: 'android',
      icon: RiAppStoreFill,
      link: 'https://apps.apple.com/in/app/leap-cosmos/id1642465549',
    },
    {
      icon: GoDesktopDownload,
      link:
        'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
    },
  ],
  connectEventNamesOnWindow: ['leap_keystorechange'],
  walletconnect: {
    name: 'Leap Cosmos Wallet',
    projectId:
      'b09b728635c6af853003a85cb3e4f9b80022eb634f2a45a9c56b8e3e172ca3b3',
    encoding: 'base64',
    mobile: {
      native: {
        ios: 'leapcosmos:',
        android: 'intent:',
      },
    },
    formatNativeUrl: (
      appUrl: string,
      wcUri: string,
      os: OS | undefined,
      name: string
    ): string => {
      const plainAppUrl = appUrl.replaceAll('/', '').replaceAll(':', '');
      const encodedWcUrl = encodeURIComponent(wcUri);
      switch (os) {
        case 'ios':
          return `${plainAppUrl}://wcV2?${encodedWcUrl}`;
        case 'android':
          return `${plainAppUrl}://wcV2?${encodedWcUrl}#Intent;package=io.leapwallet.cosmos;scheme=leapwallet;end;`;
        default:
          return `${plainAppUrl}://wcV2?${encodedWcUrl}`;
      }
    },
  },
};
