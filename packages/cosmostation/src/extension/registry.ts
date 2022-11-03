import { Wallet } from '@cosmos-kit/core';
import { FaAndroid } from 'react-icons/fa';
import { RiAppStoreFill, RiChromeFill } from 'react-icons/ri';

export const cosmostationExtensionInfo: Wallet = {
  name: 'cosmostation-extension',
  logo: 'https://raw.githubusercontent.com/cosmostation/cosmostation_token_resource/master/dapps/cosmostation/cosmoskit/cosmostation.png',
  prettyName: 'Cosmostation Extension',
  mode: 'extension',
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
  mobileDisabled: true,
  rejectMessage: {
    source:
      'The requested account and/or method has not been authorized by the user.',
    target:
      'The requested account and/or method has not been authorized by the user. \n Open Extension/App to authorize this site before retrying.',
  },
};
