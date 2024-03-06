import { ClientNotExistError } from '@cosmos-kit/core';
import { Keplr, Window as OWalletWindow } from '@keplr-wallet/types';

export const getOWalletFromExtension: () => Promise<
  Keplr | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }
  //@ts-ignore
  const owallet = (window as OWalletWindow).owallet;

  if (owallet) {
    return owallet;
  }

  if (document.readyState === 'complete') {
    if (owallet) {
      return owallet;
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
        //@ts-ignore
        const owallet = (window as OWalletWindow).owallet;
        if (owallet) {
          resolve(owallet);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
