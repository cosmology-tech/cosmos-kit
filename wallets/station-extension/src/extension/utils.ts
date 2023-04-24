import { ClientNotExistError } from '@cosmos-kit/core';

import { StationExtension } from './extension';

interface StationWindow {
  isStationExtensionAvailable?: boolean;
}

export const getStationFromExtension: () => Promise<
  StationExtension | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  if (!(window as StationWindow).isStationExtensionAvailable) {
    throw ClientNotExistError;
  }

  const stationExtension = new StationExtension();
  await stationExtension.init();

  return stationExtension;
};
