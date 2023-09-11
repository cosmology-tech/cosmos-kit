import { ClientNotExistError } from '@cosmos-kit/core';
import { CosmosSnap } from '@cosmsnap/snapper';

interface SnapWindow {
  cosmos?: CosmosSnap;
}

export const getSnapProviderFromExtension: () => Promise<
  CosmosSnap | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const cosmos = (window as SnapWindow).cosmos;

  if (cosmos) {
    return cosmos;
  }

  if (document.readyState === 'complete') {
    if (cosmos) {
      return cosmos;
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
