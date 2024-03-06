import { preferredEndpoints } from './config';
import { owalletExtensionInfo, OwalletExtensionWallet } from './extension';

const owalletExtension = new OwalletExtensionWallet(
  owalletExtensionInfo,
  preferredEndpoints
);

export const wallets = [owalletExtension];
