import { ClientNotExistError } from '@cosmos-kit/core';

import { Compass } from './types';

interface CompassWindow {
  compass?: Compass;
}

export const getCompassFromExtension: () => Promise<
  Compass | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const compass = (window as CompassWindow).compass;

  if (compass) {
    return compass;
  }

  if (document.readyState === 'complete') {
    if (compass) {
      return compass;
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
        if (compass) {
          resolve(compass);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
