import { ClientNotExistError } from '@cosmos-kit/core';
import Station from '@terra-money/station-connector';

interface StationWindow {
  station?: Station;
}

export const getStationFromExtension: () => Promise<
  Station | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const station = (window as StationWindow).station;

  if (station) {
    return station;
  }

  if (document.readyState === 'complete') {
    if (station) {
      return station;
    } else {
      throw ClientNotExistError;
    }
  }

  return new Promise((resolve, reject) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        const station = (window as StationWindow).station;
        if (station) {
          resolve(station);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
