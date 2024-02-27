import { preferredEndpoints } from './config';
import { owalletMobileInfo, OwalletMobileWallet } from './wallet-connect';

const owalletMobile = new OwalletMobileWallet(
  owalletMobileInfo,
  preferredEndpoints
);

export const wallets = [owalletMobile];
