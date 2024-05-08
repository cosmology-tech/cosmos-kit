import { cosmiframeExtensionInfo, CosmiframeWallet } from './extension';

export const makeCosmiframeWallet = (allowedParentOrigins: string[]) =>
  new CosmiframeWallet({
    ...cosmiframeExtensionInfo,
    allowedParentOrigins,
  });
