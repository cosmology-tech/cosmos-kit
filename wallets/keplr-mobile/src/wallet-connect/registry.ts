import { Wallet } from '@cosmos-kit/core';
import { FaAndroid } from 'react-icons/fa';
import { GoDesktopDownload } from 'react-icons/go';
import { RiAppStoreFill } from 'react-icons/ri';

export const keplrMobileInfo: Wallet = {
  name: 'keplr-mobile',
  prettyName: 'Keplr Mobile',
  logo:
    'https://user-images.githubusercontent.com/545047/202085372-579be3f3-36e0-4e0b-b02f-48182af6e577.svg',
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
        'https://play.google.com/store/apps/details?id=com.chainapsis.keplr&hl=en&gl=US&pli=1',
    },
    {
      device: 'mobile',
      os: 'ios',
      icon: RiAppStoreFill,
      link: 'https://apps.apple.com/us/app/keplr-wallet/id1567851089',
    },
    {
      icon: GoDesktopDownload,
      link: 'https://www.keplr.app/download',
    },
  ],
  connectEventNamesOnWindow: ['keplr_keystorechange'],
  walletconnect: {
    name: 'Keplr',
    projectId:
      'afbd95522f4041c71dd4f1a065f971fd32372865b416f95a0b1db759ae33f2a7',
  },
};
