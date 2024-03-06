import { Wallet } from '@cosmos-kit/core';
import { Window as OWalletWindow } from '@keplr-wallet/types';

import { ICON } from '../constant';

export const owalletExtensionInfo: Wallet = {
  name: 'owallet-extension',
  prettyName: 'OWallet',
  logo: ICON,
  mode: 'extension',
  // In the Owallet Mobile in-app browser, Owallet is available in window.owallet,
  // similar to the extension on a desktop browser. For this reason, we must
  // check what mode the window.owallet client is in once it's available.
  mobileDisabled: () =>
    !(
      typeof document !== 'undefined' &&
      document.readyState === 'complete' &&
      //@ts-ignore
      (window as OWalletWindow).owallet &&
      //@ts-ignore
      (window as OWalletWindow).owallet.mode === 'mobile-web'
    ),
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: ['keplr_keystorechange'],
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chromewebstore.google.com/detail/owallet/hhejbopdnpbjgomhpmegemnjogflenga',
    },
    {
      link: 'https://owallet.dev',
    },
  ],
};
