import { ClientNotExistError } from '@cosmos-kit/core';

import { Ninji } from './types';

interface NinjiWindow {
  ninji?: Ninji;
}

export const getNinjiFromExtension: () => Promise<
  Ninji | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const ninji = (window as NinjiWindow).ninji;

  if (ninji) {
    return ninji;
  }

  if (document.readyState === 'complete') {
    if (ninji) {
      return ninji;
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
        if (ninji) {
          resolve(ninji);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
