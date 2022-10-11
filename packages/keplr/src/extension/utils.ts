import { ClientNoExistError } from '@cosmos-kit/core';
import { Keplr, Window as KeplrWindow } from '@keplr-wallet/types';

export const getKeplrFromExtension: () => Promise<
  Keplr | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return undefined;
  } else {
    return (window as KeplrWindow).keplr;
  }

  const keplr = (window as KeplrWindow).keplr;

  console.log(2.1, window as KeplrWindow);
  console.log(2, keplr);

  if (keplr && keplr.mode === 'extension') {
    console.log(3);
    return keplr;
  }

  if (document.readyState === 'complete') {
    if (keplr && keplr.mode === 'extension') {
      return keplr;
    } else {
      throw ClientNoExistError;
    }
  }

  return new Promise((resolve, reject) => {
    const documentStateChange = (event: Event) => {
      console.log(1243, (event.target as Document)?.readyState);
      if (
        event.target &&
        ((event.target as Document)?.readyState === 'complete' ||
          (event.target as Document)?.readyState === 'interactive')
      ) {
        if (keplr && keplr.mode === 'extension') {
          resolve(keplr);
        } else {
          reject(ClientNoExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
