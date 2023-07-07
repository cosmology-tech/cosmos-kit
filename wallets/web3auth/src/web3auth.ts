import { Web3AuthWallet, web3AuthWalletInfo } from './extension';
import { Web3AuthClientOptions, Web3AuthLoginMethod } from './extension/types';

export const makeWeb3AuthWallets = (
  options: Omit<Web3AuthClientOptions, 'loginProvider'> & {
    loginMethods: Web3AuthLoginMethod[];
  }
) =>
  options.loginMethods.map(
    ({ provider, name, logo }) =>
      new Web3AuthWallet({
        ...web3AuthWalletInfo,
        name: web3AuthWalletInfo.name + '_' + provider,
        prettyName: name,
        logo,
        options: {
          ...options,
          loginProvider: provider,
        },
      })
  );
