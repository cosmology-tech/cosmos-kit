import { praxExtensionInfo, PraxExtensionWallet } from './extension/index.js';

const praxExtension = new PraxExtensionWallet(praxExtensionInfo);

export const wallets = [praxExtension];
