import { Origin } from '@dao-dao/cosmiframe';

import { cosmiframeExtensionInfo, CosmiframeWallet } from './extension';

export const makeCosmiframeWallet = (allowedParentOrigins: Origin[]) =>
  new CosmiframeWallet({
    ...cosmiframeExtensionInfo,
    allowedParentOrigins,
  });
