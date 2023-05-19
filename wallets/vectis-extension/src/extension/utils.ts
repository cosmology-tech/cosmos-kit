import { ClientNotExistError } from '@cosmos-kit/core';

import type { Vectis, VectisWindow } from './types';

export const getVectisFromExtension: () => Promise<
  Vectis | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const vectis = ((window as unknown) as VectisWindow).vectis?.cosmos;

  if (vectis) {
    return vectis;
  }

  if (document.readyState === 'complete') {
    if (vectis) {
      return vectis;
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
        if (vectis) {
          resolve(vectis);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
