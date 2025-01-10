import { Origin } from '@dao-dao/cosmiframe';

import { Wallet } from '../../types';

export type CosmiframeWalletInfo = Wallet & {
  allowedParentOrigins: Origin[];
};
