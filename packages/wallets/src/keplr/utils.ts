import { Keplr, Window as KeplrWindow } from '@keplr-wallet/types';

const error = new Error('No keplr extension installed!');

export const getKeplrFromExtension: () => Promise<Keplr> = async () => {
  if (typeof window === 'undefined') {
    throw error;
  }

  const keplr = (window as KeplrWindow).keplr;

  if (keplr) {
    return keplr;
  }

  if (document.readyState === 'complete') {
    if (!keplr) {
      throw error;
    } else {
      return keplr;
    }
  }

  return new Promise((resolve, reject) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        if (!keplr) {
          reject(error.message);
        } else {
          resolve(keplr);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
