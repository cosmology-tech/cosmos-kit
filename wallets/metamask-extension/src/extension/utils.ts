import { ClientNotExistError } from '@cosmos-kit/core';
import { Extension } from '@terra-money/terra.js';

export const getMetamaskFromExtension: () => Promise<
  Extension | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const eth = (window as any).ethereum;

  if (eth && eth.isMetaMask) {
    return eth;
  }

  if (document.readyState === 'complete') {
    throw ClientNotExistError;
  }

  return new Promise((resolve, reject) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (eth && eth?.isMetaMask) {
          resolve(eth);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
