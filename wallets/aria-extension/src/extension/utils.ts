import { ClientNotExistError } from '@cosmos-kit/core';

import { Aria } from './types';

interface AriaWindow {
  aria?: Aria;
}

export const getAriaFromExtension: () => Promise<
  Aria | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const aria = (window as AriaWindow).aria;

  if (aria) {
    return aria;
  }

  if (document.readyState === 'complete') {
    if (aria) {
      return aria;
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
        if (aria) {
          resolve(aria);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
