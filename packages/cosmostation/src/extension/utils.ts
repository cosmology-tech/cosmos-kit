import * as protoSigning from '@cosmjs/proto-signing';
import { ClientNotExistError } from '@cosmos-kit/core';
import { getExtensionOfflineSigner } from '@cosmostation/cosmos-client';
import { InstallError } from '@cosmostation/extension-client';

import { Cosmostation } from './types';

export const getCosmostationFromExtension: () => Promise<
  Cosmostation | undefined
> = async () => {
  try {
    return new CosmostationExtensionWallet();
  } catch (e) {
    if (e instanceof InstallError) {
      throw ClientNotExistError;
    }
  }
};
export class CosmostationExtensionWallet implements Cosmostation {
  async getOfflineSigner(chainId: string): Promise<protoSigning.OfflineSigner> {
    return getExtensionOfflineSigner(chainId);
  }
}
