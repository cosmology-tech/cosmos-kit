import { compassExtensionInfo, CompassExtensionWallet } from './extension';

const compassExtension = new CompassExtensionWallet(compassExtensionInfo);

export const wallets = [compassExtension];
