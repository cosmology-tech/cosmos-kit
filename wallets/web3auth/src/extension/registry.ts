import { Wallet } from '@cosmos-kit/core';

export const web3AuthWalletInfo: Wallet = {
  name: 'web3auth',
  prettyName: 'Web3Auth',
  mode: 'extension',
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  logo: 'https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/ed7ca96549265c47cd7ad1936a49b5d58113823c/public/images/logos/wallets/web3auth.svg',
};
