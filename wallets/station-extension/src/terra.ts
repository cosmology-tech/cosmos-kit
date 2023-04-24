import { terraExtensionInfo, TerraExtensionWallet } from './extension';

const terraExtension = new TerraExtensionWallet(terraExtensionInfo);

export const wallets = [terraExtension];
