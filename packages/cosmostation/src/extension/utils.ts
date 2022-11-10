import { ClientNotExistError } from '@cosmos-kit/core';

import { Cosmostation } from './types';

interface CosmostationWindow {
  cosmostation?: {
    cosmos: Cosmostation;
  };
}

export const getCosmostationFromExtension: () => Promise<
  Cosmostation | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const cosmostation = (window as CosmostationWindow).cosmostation?.cosmos;

  if (cosmostation) {
    return cosmostation;
  }

  if (document.readyState === 'complete') {
    if (cosmostation) {
      return cosmostation;
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
        if (cosmostation) {
          resolve(cosmostation);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
