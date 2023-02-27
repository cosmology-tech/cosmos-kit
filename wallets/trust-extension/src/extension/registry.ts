import { Wallet } from '@cosmos-kit/core';

export const trustExtensionInfo: Wallet = {
  name: 'trust-extension',
  logo: 'https://trustwallet.com/assets/images/media/assets/TWT.png',
  prettyName: 'Trust',
  mode: 'extension',
  mobileDisabled: true,
  rejectMessage: {
    source: 'Request rejected',
  },
  downloads: [
    {
      device: 'mobile',
      os: 'android',
      link: 'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp&referrer=utm_source%3Dwebsite',
    },
    {
      device: 'mobile',
      os: 'ios',
      link: 'https://apps.apple.com/app/apple-store/id1288339409?mt=8',
    },
  ],
};
