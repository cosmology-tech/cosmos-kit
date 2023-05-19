import { ClientNotExistError } from '@cosmos-kit/core';

import { Frontier } from './types';

interface FrontierWindow {
  frontier?: {
    cosmos: Frontier;
  };
}

export const getFrontierFromExtension: () => Promise<
  Frontier | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const frontier = (window as FrontierWindow).frontier?.cosmos;

  if (frontier) {
    return frontier;
  }

  if (document.readyState === 'complete') {
    if (frontier) {
      return frontier;
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
        if (frontier) {
          resolve(frontier);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
