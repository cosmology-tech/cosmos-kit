import { Wallet } from '@cosmos-kit/core';
import { FaAndroid } from 'react-icons/fa';
import { GoDesktopDownload } from 'react-icons/go';
import { RiAppStoreFill } from 'react-icons/ri';

export const omniMobileInfo: Wallet = {
  name: 'omni-mobile',
  prettyName: 'Omni Mobile',
  logo:
    'https://explorer-api.walletconnect.com/v3/logo/lg/2cd67b4c-282b-4809-e7c0-a88cd5116f00?projectId=a8510432ebb71e6948cfd6cde54b70f7',
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
  wcProjectId:
    'afbd95522f4041c71dd4f1a065f971fd32372865b416f95a0b1db759ae33f2a7',
};
