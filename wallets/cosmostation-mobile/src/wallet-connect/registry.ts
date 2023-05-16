import { Wallet } from '@cosmos-kit/core';

export const cosmostationMobileInfo: Wallet = {
  name: 'cosmostation-mobile',
  prettyName: 'Cosmostation Mobile',
  logo:
    'https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/cosmostation.png',
  mode: 'wallet-connect',
  downloads: [
    {
      device: 'mobile',
      os: 'android',
      link:
        'https://play.google.com/store/apps/details?id=wannabit.io.cosmostaion',
    },
    {
      device: 'mobile',
      os: 'ios',
      link: 'https://apps.apple.com/kr/app/cosmostation/id1459830339',
    },
    {
      link: 'https://cosmostation.io/wallet/#extension',
    },
  ],
  mobileDisabled: false,
  walletconnect: {
    name: 'Cosmostation',
    projectId:
      'feb6ff1fb426db18110f5a80c7adbde846d0a7e96b2bc53af4b73aaf32552bea',
    formatNativeUrl: (appUrl: string, wcUri: string, name: string): string => {
      const plainAppUrl = appUrl.replaceAll('/', '').replaceAll(':', '');
      // const encodedWcUrl = encodeURIComponent(wcUri);
      return `${plainAppUrl}://wc?${wcUri}`;
    },
  },
};
