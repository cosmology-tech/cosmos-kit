import { Wallet } from '@cosmos-kit/core';
import { FaAndroid } from 'react-icons/fa';
import { GoDesktopDownload } from 'react-icons/go';
import { RiAppStoreFill } from 'react-icons/ri';

export const trustMobileInfo: Wallet = {
  name: 'trust-mobile',
  prettyName: 'Trust Mobile',
  logo: 'https://trustwallet.com/assets/images/media/assets/TWT.png',
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
      link: 'https://play.google.com/store/apps/details?id=com.chainapsis.trust&hl=en&gl=US&pli=1',
    },
    {
      device: 'mobile',
      os: 'ios',
      icon: RiAppStoreFill,
      link: 'https://apps.apple.com/us/app/trust-wallet/id1567851089',
    },
    {
      icon: GoDesktopDownload,
      link: 'https://www.trust.app/download',
    },
  ],
  connectEventNamesOnWindow: ['trust_keystorechange'],
};
