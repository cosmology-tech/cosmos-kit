import { preferredEndpoints } from './config';
import { FinExtensionInfo, FinExtensionWallet } from './extension';

const finExtension = new FinExtensionWallet(
  FinExtensionInfo,
  preferredEndpoints
);

export const wallets = [finExtension];
