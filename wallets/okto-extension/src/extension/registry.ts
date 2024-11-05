import { Wallet } from '@cosmos-kit/core';
import { ICON } from '../constant';

export const oktoExtensionInfo: Wallet = {
  name: 'okto-extension',
  prettyName: 'Okto',
  logo: ICON,
  mode: 'extension',
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: ['okto_keystorechange'],
  downloads: [
    {
      link: 'https://www.okto.tech',
    },
  ],
};
