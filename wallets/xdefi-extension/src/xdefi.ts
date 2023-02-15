import { xdefiExtensionInfo, XDEFIExtensionWallet } from './extension';

const xdefiExtension = new XDEFIExtensionWallet(xdefiExtensionInfo);

export const wallets = [xdefiExtension];
