import { preferredEndpoints } from './config';
import { shellExtensionInfo, ShellExtensionWallet } from './extension';

const shellExtension = new ShellExtensionWallet(
  shellExtensionInfo,
  preferredEndpoints
);

export const wallets = [shellExtension];
