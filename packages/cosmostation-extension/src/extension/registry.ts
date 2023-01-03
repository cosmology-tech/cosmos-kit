import { Wallet } from '@cosmos-kit/core';
import { GoDesktopDownload } from 'react-icons/go';
import { RiChromeFill } from 'react-icons/ri';

export const cosmostationExtensionInfo: Wallet = {
  name: 'cosmostation-extension',
  logo: 'https://raw.githubusercontent.com/cosmostation/cosmostation_token_resource/master/dapps/cosmostation/cosmoskit/cosmostation.png',
  prettyName: 'Cosmostation',
  mode: 'extension',
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      icon: RiChromeFill,
      link: 'https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf?hl=en',
    },
    {
      icon: GoDesktopDownload,
      link: 'https://cosmostation.io/wallet/#extension',
    },
  ],
  mobileDisabled: true,
  rejectMessage: {
    source:
      'The requested account and/or method has not been authorized by the user.',
    // target:
    //   'The requested account and/or method has not been authorized by the user. \n Open Extension/App to authorize this site before retrying.',
  },
  rejectCode: 4001,
  connectEventNamesOnClient: ['accountChanged'],
};
