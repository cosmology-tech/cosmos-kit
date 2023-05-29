import { preferredEndpoints } from './extension/config/endpoints';
import { keplrExtensionInfo, KeplrExtensionWallet } from './extension';

const keplrExtension = new KeplrExtensionWallet(
  keplrExtensionInfo,
  preferredEndpoints
);

export const wallets = [keplrExtension];
