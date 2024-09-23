import { ClientNotExistError } from '@cosmos-kit/core';

import { Okto } from './types';

interface OktoWindow {
  okto?: Okto;
}

export const getOktoFromExtension: () => Promise<
  Okto | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const okto = (window as OktoWindow).okto;

  if (okto) {
    return okto;
  }

  if (document.readyState === 'complete') {
    if (okto) {
      return okto;
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
        if (okto) {
          resolve(okto);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
