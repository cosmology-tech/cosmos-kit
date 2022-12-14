import { Wallet } from '@cosmos-kit/core';
import { FaAndroid } from 'react-icons/fa';
import { GoDesktopDownload } from 'react-icons/go';
import { RiAppStoreFill } from 'react-icons/ri';

export const omniMobileInfo: Wallet = {
  name: 'omni-mobile',
  prettyName: 'Omni Mobile',
  logo:
    'https://user-images.githubusercontent.com/545047/191616515-eee176d0-9e50-4325-9529-6c0019d5c71a.png',
  mode: 'wallet-connect',
  mobileDisabled: false,
  wcProjectId:
    'afbd95522f4041c71dd4f1a065f971fd32372865b416f95a0b1db759ae33f2a7',
  rejectMessage: {
    source: 'Request rejected',
  },
  downloads: [
    {
      device: 'mobile',
      os: 'android',
      icon: FaAndroid,
      link:
        'https://play.google.com/store/apps/details?id=com.chainapsis.omni&hl=en&gl=US&pli=1',
    },
    {
      device: 'mobile',
      os: 'ios',
      icon: RiAppStoreFill,
      link: 'https://apps.apple.com/us/app/omni-wallet/id1567851089',
    },
    {
      icon: GoDesktopDownload,
      link: 'https://www.omni.app/download',
    },
  ],
  connectEventNamesOnWindow: ['omni_keystorechange'],
};
