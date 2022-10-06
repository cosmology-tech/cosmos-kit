import { Wallet } from '@cosmos-kit/core';
import { FaAndroid } from 'react-icons/fa';
import { GrFirefox } from 'react-icons/gr';
import { RiAppStoreFill, RiChromeFill } from 'react-icons/ri';

export const walletInfo: Wallet = {
  name: 'trust-wallet',
  logo: 'https://trustwallet.com/assets/images/media/assets/TWT.png',
  prettyName: 'Trust Wallet',
  isQRCode: false,
  downloads: {
    tablet: [
      {
        os: 'android',
        icon: FaAndroid,
        link: 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp&referrer=utm_source%3Dwebsite',
      },
      {
        os: 'ios',
        icon: RiAppStoreFill,
        link: 'https://apps.apple.com/app/apple-store/id1288339409?mt=8',
      },
    ],
    mobile: [
      {
        os: 'android',
        icon: FaAndroid,
        link: 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp&referrer=utm_source%3Dwebsite',
      },
      {
        os: 'ios',
        icon: RiAppStoreFill,
        link: 'https://apps.apple.com/app/apple-store/id1288339409?mt=8',
      },
    ],
    default: 'https://trustwallet.com/',
  },
};
