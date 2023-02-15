import { Wallet } from '@cosmos-kit/core';
import { FaAndroid } from 'react-icons/fa';
import { GoDesktopDownload } from 'react-icons/go';
import { RiAppStoreFill } from 'react-icons/ri';

export const cosmostationMobileInfo: Wallet = {
  name: 'cosmostation-mobile',
  prettyName: 'Cosmostation Mobile',
  logo:
    'https://user-images.githubusercontent.com/74940804/202999324-fa2faf40-5ead-4896-b865-e97f052fc6f9.png',
  mode: 'wallet-connect',
  downloads: [
    {
      device: 'mobile',
      os: 'android',
      icon: FaAndroid,
      link:
        'https://play.google.com/store/apps/details?id=wannabit.io.cosmostaion',
    },
    {
      device: 'mobile',
      os: 'ios',
      icon: RiAppStoreFill,
      link: 'https://apps.apple.com/kr/app/cosmostation/id1459830339',
    },
    {
      icon: GoDesktopDownload,
      link: 'https://cosmostation.io/wallet/#extension',
    },
  ],
  mobileDisabled: false,
  walletconnect: {
    name: 'Cosmostation',
    projectId:
      'feb6ff1fb426db18110f5a80c7adbde846d0a7e96b2bc53af4b73aaf32552bea',
  },
};
