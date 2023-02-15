import { ClientNotExistError } from '@cosmos-kit/core';

import { XDEFI } from './types';

interface XDEFIWindow {
  keplr?: XDEFI;
}

export const getXDEFIFromExtension: () => Promise<
  XDEFI | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const xdefi = (window as XDEFIWindow).keplr;

  if (xdefi) {
    return xdefi;
  }

  if (document.readyState === 'complete') {
    if (xdefi) {
      return xdefi;
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
        if (xdefi) {
          resolve(xdefi);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
