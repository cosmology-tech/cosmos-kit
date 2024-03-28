import { ClientNotExistError } from '@cosmos-kit/core';
import { TailwindWallet } from '@tailwindzone/connect';

export const getWalletFromWindow: () => Promise<
  TailwindWallet | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }
  const tailwind = window.tailwind;

  if (tailwind) {
    return tailwind;
  }

  if (document.readyState === 'complete') {
    if (tailwind) {
      return tailwind;
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
        // re-declare variable inside the event listener
        const tailwind = window.tailwind;
        if (tailwind) {
          resolve(tailwind);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
