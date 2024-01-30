import { ClientNotExistError } from '@cosmos-kit/core';

import { InitiaWallet } from './type';

interface InitiaWindow {
  initia?: InitiaWallet;
}

export const getInitiaFromExtension: () => Promise<
  InitiaWallet | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const initia = (window as InitiaWindow).initia;

  if (initia) {
    return initia;
  }

  if (document.readyState === 'complete') {
    if (initia) {
      return initia;
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
        const initia = (window as InitiaWindow).initia;
        if (initia) {
          resolve(initia);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
