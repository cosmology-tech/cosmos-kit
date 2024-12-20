import { ClientNotExistError } from '@cosmos-kit/core';

import { CTRL } from './types';

interface CTRLWindow {
  xfi?: {
    keplr?: CTRL;
  };
}

export const getCTRLFromExtension: () => Promise<
  CTRL | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const ctrl = (window as CTRLWindow)?.xfi?.keplr;

  if (ctrl) {
    return ctrl;
  }

  if (document.readyState === 'complete') {
    if (ctrl) {
      return ctrl;
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
        const ctrl = (window as CTRLWindow)?.xfi?.keplr;
        if (ctrl) {
          resolve(ctrl);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
