import { Keplr, Window as KeplrWindow } from '@keplr-wallet/types';

export const getKeplrFromExtension: () => Promise<
  Keplr | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  if ((window as KeplrWindow).keplr) {
    return (window as KeplrWindow).keplr;
  }

  if (document.readyState === 'complete') {
    return (window as KeplrWindow).keplr;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
        resolve((window as KeplrWindow).keplr);
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
