import { Wallet } from '@cosmos-kit/core';

export const FinExtensionInfo: Wallet = {
  name: 'fin-extension',
  logo: 'https://lh3.googleusercontent.com/oKvetnosutN7Q7daICbew7k9kLLB1unNlggkA-mZZZZIdNWp7vJFpz5q9MZ73Wlw5S5KrHV5mEQ0UEKYaDWz5qmacHw=w128-h128-e365-rj-sc0x00ffffff',
  prettyName: 'Fin',
  mode: 'extension',
  //Enable for dapp browser
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: [
    'accountsChanged', 
    'networkChanged',
  ],
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chrome.google.com/webstore/detail/fin-wallet-for-sei/dbgnhckhnppddckangcjbkjnlddbjkna',
    },
    {
      link: 'https://finwallet.com/',
    },
  ],
};
