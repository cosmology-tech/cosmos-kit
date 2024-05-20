import { cosmjsExtensionInfo, CosmjsExtensionWallet } from './extension';

const cosmjsExtension = new CosmjsExtensionWallet(cosmjsExtensionInfo);

export const wallets = [cosmjsExtension];
