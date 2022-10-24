import { Wallet } from '@cosmos-kit/core';
import { FaAndroid } from 'react-icons/fa';
import { RiAppStoreFill, RiChromeFill } from 'react-icons/ri';

export const cosmostationExtensionInfo: Wallet = {
  name: 'cosmostation-extension',
  logo: 'https://raw.githubusercontent.com/cosmostation/cosmostation_token_resource/master/dapps/cosmostation/cosmoskit/cosmostation.png',
  prettyName: 'Cosmostation Extension',
  isQRCode: false,
  downloads: {
    desktop: [
      {
        browser: 'chrome',
        icon: RiChromeFill,
        link: 'https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf?hl=en',
      },
    ],
    mobile: [
      {
        os: 'android',
        icon: FaAndroid,
        link: 'https://play.google.com/store/apps/details?id=wannabit.io.cosmostaion',
      },
      {
        os: 'ios',
        icon: RiAppStoreFill,
        link: 'https://apps.apple.com/kr/app/cosmostation/id1459830339',
      },
    ],
    default: 'https://cosmostation.io/wallet',
  },
};
