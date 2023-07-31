import { ClientNotExistError } from '@cosmos-kit/core';

import { Okxwallet } from './types';

interface OkxwalltWindow {
  okxwallet?: OkxwalletExtension;
}

interface OkxwalletExtension {
  keplr?: Okxwallet;
}

export const getOkxwalletFromExtension: () => Promise<
  Okxwallet | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const okxwallet = (window as OkxwalltWindow).okxwallet?.keplr;

  if (okxwallet) {
    return okxwallet;
  }

  if (document.readyState === 'complete') {
    if (okxwallet) {
      return okxwallet;
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
        if (okxwallet) {
          resolve(okxwallet);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
