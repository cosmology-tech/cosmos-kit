import { ClientNotExistError } from '@cosmos-kit/core';
import { Extension } from '@terra-money/terra.js';

export const getTerrastationFromExtension: () => Promise<
  Extension | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  if (window.isTerraExtensionAvailable) {
    return new Extension('station');
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
        if (window.isTerraExtensionAvailable) {
          resolve(new Extension('station'));
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
