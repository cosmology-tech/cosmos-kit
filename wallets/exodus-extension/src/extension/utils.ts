import { ClientNotExistError } from '@cosmos-kit/core';

import type { Exodus, ExodusWindow } from '../types';

export const getExodusFromExtension: () => Promise<
  Exodus | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const exodus = ((window as unknown) as ExodusWindow).exodus;

  if (exodus) {
    return exodus;
  }

  if (document.readyState === 'complete') {
    if (exodus) {
      return exodus;
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
        if (exodus) {
          resolve(exodus);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
