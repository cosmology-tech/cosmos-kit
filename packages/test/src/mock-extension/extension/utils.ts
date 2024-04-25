import { ClientNotExistError } from '@cosmos-kit/core';

import { Mock } from './types';

interface MockWindow {
  mock?: Mock;
}

export const getMockFromExtension: () => Promise<
  Mock | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const mock = (window as MockWindow).mock;

  if (mock) {
    return mock;
  }

  if (document.readyState === 'complete') {
    if (mock) {
      return mock;
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
        if (mock) {
          resolve(mock);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
