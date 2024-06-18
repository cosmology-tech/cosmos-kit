import { cosmjsExtensionInfo, CosmjsExtensionWallet } from './extension';

export const wallets = [
  (mnemonic?: string) => new CosmjsExtensionWallet(cosmjsExtensionInfo, mnemonic),
];
