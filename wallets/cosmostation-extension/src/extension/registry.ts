import { Wallet } from '@cosmos-kit/core';

export const cosmostationExtensionInfo: Wallet = {
  name: 'cosmostation-extension',
  logo:
    'https://raw.githubusercontent.com/cosmostation/cosmostation_token_resource/master/dapps/cosmostation/cosmoskit/cosmostation.png',
  prettyName: 'Cosmostation',
  mode: 'extension',
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link:
        'https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf?hl=en',
    },
    {
      link: 'https://cosmostation.io/wallet/#extension',
    },
  ],
  mobileDisabled: true,
  rejectMessage:
    'The requested account and/or method has not been authorized by the user.',
  rejectCode: 4001,
  connectEventNamesOnClient: ['accountChanged'],
};
