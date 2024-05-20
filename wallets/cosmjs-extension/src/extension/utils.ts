import { ClientNotExistError } from '@cosmos-kit/core';

import { Cosmjs } from './types';

interface CosmjsWindow {
  cosmjs?: Cosmjs;
}

export const getCosmjsFromExtension: () => Promise<Cosmjs | undefined> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const cosmjs = (window as CosmjsWindow).cosmjs;

  if (cosmjs) {
    return cosmjs;
  }

  if (document.readyState === 'complete') {
    if (cosmjs) {
      return cosmjs;
    } else {
      throw ClientNotExistError;
    }
  }

  return new Promise((resolve, reject) => {
    const documentStateChange = (event: Event) => {
      if (event.target && (event.target as Document).readyState === 'complete') {
        if (cosmjs) {
          resolve(cosmjs);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
