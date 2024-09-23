import { ClientNotExistError } from '@cosmos-kit/core';

import { IMToken } from './types';

interface IMTokenWindow {
  cosmos?: IMToken;
}

export const getIMTokenFromExtension: () => Promise<
  IMToken | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const cosmos = (window as IMTokenWindow).cosmos;

  if (cosmos) {
    return cosmos;
  }

  if (document.readyState === 'complete') {
    if (cosmos) {
      return cosmos;
    }
    throw ClientNotExistError;
  }

  return new Promise((resolve, reject) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (cosmos) {
          resolve(cosmos);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
