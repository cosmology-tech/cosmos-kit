import { Wallet } from '@cosmos-kit/core';

import logo from './logo.svg';

export const web3AuthWalletInfo: Wallet = {
  name: 'web3auth',
  prettyName: 'Web3Auth',
  logo: logo,
  mode: 'extension',
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
};
