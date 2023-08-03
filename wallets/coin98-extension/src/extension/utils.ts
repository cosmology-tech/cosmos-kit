import { ClientNotExistError } from '@cosmos-kit/core';

import { Coin98 } from './types';
// import { Keplr, Window as KeplrWindow } from '@keplr-wallet/types';

interface Coin98Window {
  coin98?: {
    keplr: Coin98;
  };
}

export const getCoin98FromExtension: () => Promise<
  Coin98 | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const provider = (window as Coin98Window).coin98?.keplr;

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
