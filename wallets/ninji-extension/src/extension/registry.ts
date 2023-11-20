import { Wallet } from '@cosmos-kit/core';

import { ICON } from '../constant';

export const ninjiExtensionInfo: Wallet = {
  name: 'ninji-extension',
  prettyName: 'Ninji',
  logo: ICON,
  mode: 'extension',
  mobileDisabled: () =>
    !('ninji' in window || /NinjiCosmos/i.test(navigator.userAgent)),
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: ['accountsChanged', 'networkChanged'],
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chromewebstore.google.com/detail/ninji-wallet/kkpllbgjhchghjapjbinnoddmciocphm',
    },
    {
      link: 'https://ninji.xyz/#download',
    },
  ],
};
