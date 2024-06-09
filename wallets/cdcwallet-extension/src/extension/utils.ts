import { ClientNotExistError } from '@cosmos-kit/core';

import { Cdcwallet } from './types';

export interface CdcwalletWindow {
  cdc_wallet?: {
    cosmos?: Cdcwallet;
  };
}

export const getCdcwalletFromExtension: () => Promise<
  Cdcwallet | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const cdcwallet = (window as CdcwalletWindow).cdc_wallet?.cosmos;

  if (cdcwallet) {
    return cdcwallet;
  }

  if (document.readyState === 'complete') {
    if (cdcwallet) {
      return cdcwallet;
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
        if (cdcwallet) {
          resolve(cdcwallet);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
