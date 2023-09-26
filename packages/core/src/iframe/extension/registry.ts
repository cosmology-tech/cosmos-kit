import {
  IFRAME_DEFAULT_LOGO,
  IFRAME_DEFAULT_PRETTY_NAME,
  IFRAME_KEYSTORECHANGE_EVENT,
  IFRAME_WALLET_ID,
  Wallet,
} from '../../types';

export const iframeExtensionInfo: Wallet = {
  name: IFRAME_WALLET_ID,
  prettyName: IFRAME_DEFAULT_PRETTY_NAME,
  logo: IFRAME_DEFAULT_LOGO,
  mode: 'extension',
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: [IFRAME_KEYSTORECHANGE_EVENT],
};
