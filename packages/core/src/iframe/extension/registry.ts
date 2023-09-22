import {
  IFRAME_KEYSTORECHANGE_EVENT,
  IFRAME_WALLET_ID,
  Wallet,
} from '../../types';

export const iframeExtensionInfo: Wallet = {
  name: IFRAME_WALLET_ID,
  prettyName: 'Outer Wallet',
  mode: 'extension',
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: [IFRAME_KEYSTORECHANGE_EVENT],
};
