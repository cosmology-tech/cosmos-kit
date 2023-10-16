import { ClientNotExistError } from '@cosmos-kit/core';

import { XDEFI } from './types';

interface XDEFIWindow {
  xfi?: {
    keplr?: XDEFI;
  };
}

export const getXDEFIFromExtension: () => Promise<
  XDEFI | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const xdefi = (window as XDEFIWindow)?.xfi?.keplr;

  if (xdefi && !xdefi.isXDEFI) {
    throw ClientNotExistError;
  }

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
        const xdefi = (window as XDEFIWindow)?.xfi?.keplr;
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
