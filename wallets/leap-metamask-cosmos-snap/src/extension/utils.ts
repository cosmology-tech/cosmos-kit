import { ClientNotExistError } from '@cosmos-kit/core';

interface MetamaskWindow {
  ethereum?: {
    isMetaMask?: boolean;
  };
}

export const isMetamaskInstalled: () => Promise<boolean> = async () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const ethereum = (window as MetamaskWindow).ethereum;

  if (ethereum?.isMetaMask) {
    return true;
  }

  if (document.readyState === 'complete') {
    if (ethereum?.isMetaMask) {
      return true;
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
        if (ethereum?.isMetaMask) {
          resolve(true);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
