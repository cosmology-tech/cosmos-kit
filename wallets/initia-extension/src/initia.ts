import { initiaExtensionInfo, InitiaExtensionWallet } from './extension';

const initiaExtension = new InitiaExtensionWallet(initiaExtensionInfo);

export const wallets = [initiaExtension];
