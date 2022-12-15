import { Wallet } from '@cosmos-kit/core';
import { FaAndroid } from 'react-icons/fa';
import { GoDesktopDownload } from 'react-icons/go';
import { RiAppStoreFill } from 'react-icons/ri';

export const cosmostationMobileInfo: Wallet = {
  name: 'cosmostation-mobile',
  prettyName: 'Cosmostation Mobile',
  logo:
    'https://raw.githubusercontent.com/cosmostation/cosmostation_token_resource/master/dapps/cosmostation/cosmoskit/cosmostation-wc.png',
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
};
