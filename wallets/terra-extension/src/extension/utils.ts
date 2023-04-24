import { ClientNotExistError } from '@cosmos-kit/core';

import { TerraExtension } from './extension';

interface TerraWindow {
  isStationExtensionAvailable?: boolean;
}

export const getTerraFromExtension: () => Promise<
  TerraExtension | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  if (!(window as TerraWindow).isStationExtensionAvailable) {
    throw ClientNotExistError;
  }

  const terraExtension = new TerraExtension();
  await terraExtension.init();

  return terraExtension;
};
