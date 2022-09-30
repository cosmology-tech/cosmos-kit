import { Keplr, Window as KeplrWindow } from '@keplr-wallet/types';

const error = new Error('No keplr extension installed!');

export const getKeplrFromExtension: () => Promise<
  Keplr | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const keplr = (window as KeplrWindow).keplr;

  if (keplr && keplr.mode === 'extension') {
    return keplr;
  }

  if (document.readyState === 'complete') {
    if (keplr && keplr.mode === 'extension') {
      return keplr;
    } else {
      throw error;
    }
  }

  return new Promise((resolve, reject) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (keplr && keplr.mode === 'extension') {
          resolve(keplr);
        } else {
          reject(error.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
