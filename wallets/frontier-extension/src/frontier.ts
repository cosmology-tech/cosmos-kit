import { frontierExtensionInfo, FrontierExtensionWallet } from './extension';

const frontierExtension = new FrontierExtensionWallet(frontierExtensionInfo);

export const wallets = [frontierExtension];
