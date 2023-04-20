import { Wallet } from '@cosmos-kit/core';

export const web3AuthWalletInfo: Wallet = {
  name: 'web3auth',
  prettyName: 'Web3Auth',
  mode: 'extension',
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  logo: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
};
