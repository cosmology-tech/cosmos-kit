import { ClientNotExistError } from '@cosmos-kit/core';

import { Trust } from './types';

interface TrustWindow {
  trustwallet?: TrustExtension;
}

interface TrustExtension {
  cosmos?: Trust;
}

export const getTrustFromExtension: () => Promise<
  Trust | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const trust = (window as TrustWindow).trustwallet?.cosmos;

  if (trust) {
    return trust;
  }

  if (document.readyState === 'complete') {
    if (trust) {
      return trust;
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
        if (trust) {
          resolve(trust);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
