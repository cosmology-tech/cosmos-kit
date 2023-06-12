import { preferredEndpoints } from './config';
import { exodusExtensionInfo, ExodusExtensionWallet } from './extension';

const exodusExtension = new ExodusExtensionWallet(
  exodusExtensionInfo,
  preferredEndpoints
);

export const wallets = [exodusExtension];
