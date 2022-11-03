import { ClientNotExistError } from '@cosmos-kit/core';

import { Leap } from './types';

interface LeapWindow {
  leap?: Leap;
}

export const getLeapFromExtension: () => Promise<
  Leap | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const leap = (window as LeapWindow).leap;

  if (leap) {
    return leap;
  }

  if (document.readyState === 'complete') {
    if (leap) {
      return leap;
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
        if (leap) {
          resolve(leap);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
