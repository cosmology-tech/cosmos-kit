import { Wallet } from '../../types';

export type CosmiframeWalletInfo = Wallet & {
  allowedParentOrigins: string[];
};
