import { ClientNotExistError } from '@cosmos-kit/core';
import { Keplr, Window as KeplrWindow } from '@keplr-wallet/types';

export const getKeplrFromExtension: () => Promise<
  Keplr | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const keplr = (window as KeplrWindow).keplr;

  if (keplr) {
    return keplr;
  }

  if (document.readyState === 'complete') {
    if (keplr) {
      return keplr;
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
        if (keplr) {
          resolve(keplr);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
