import { ClientNotExistError } from '@cosmos-kit/core';
import { Fin } from './types';
// import { Keplr, Window as KeplrWindow } from '@keplr-wallet/types';

interface FinWindow {
  fin?: Fin;
}

export const getFinFromExtension: () => Promise<Fin | undefined> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const provider = (window as FinWindow).fin;

  if (provider) {
    return provider;
  }

  if (document.readyState === 'complete') {
    if (provider) {
      return provider;
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
        if (provider) {
          resolve(provider);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
