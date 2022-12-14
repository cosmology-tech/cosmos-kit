import { ClientNotExistError } from '@cosmos-kit/core';
import { Omni, Window as OmniWindow } from '@omni-wallet/types';

export const getOmniFromExtension: () => Promise<
  Omni | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const omni = (window as OmniWindow).omni;

  if (omni) {
    return omni;
  }

  if (document.readyState === 'complete') {
    if (omni) {
      return omni;
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
        if (omni) {
          resolve(omni);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
