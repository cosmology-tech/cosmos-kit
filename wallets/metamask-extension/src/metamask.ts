import { metamaskExtensionInfo, MetamaskExtensionWallet } from './extension';

const metamaskExtension = new MetamaskExtensionWallet(metamaskExtensionInfo);

export const wallets = [metamaskExtension];
