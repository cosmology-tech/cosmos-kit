import { Wallet } from '@cosmos-kit/core';

export const iframeExtensionInfo: Wallet = {
  name: 'iframe-parent',
  prettyName: 'Iframe Parent',
  mode: 'extension',
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: ['iframe_keystorechange'],
};
