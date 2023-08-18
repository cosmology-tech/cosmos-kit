import { IFRAME_KEYSTORECHANGE_EVENT, Wallet } from '@cosmos-kit/core';

export const iframeExtensionInfo: Wallet = {
  name: 'iframe-parent',
  prettyName: 'Iframe Parent',
  mode: 'extension',
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: [IFRAME_KEYSTORECHANGE_EVENT],
};
