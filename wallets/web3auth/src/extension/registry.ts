import { Wallet } from '@cosmos-kit/core';

export const web3AuthWalletInfo: Wallet = {
  name: 'web3auth',
  prettyName: 'Web3Auth',
  mode: 'extension',
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  logo: 'https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/public/images/logos/wallets/web3auth.svg',
};
