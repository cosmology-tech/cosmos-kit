import {
  IFRAME_KEYSTORECHANGE_EVENT,
  IFRAME_WALLET_ID,
  Wallet,
} from '@cosmos-kit/core';

export const iframeExtensionInfo: Wallet = {
  name: IFRAME_WALLET_ID,
  prettyName: 'Iframe Parent',
  mode: 'extension',
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: [IFRAME_KEYSTORECHANGE_EVENT],
};
