import { ClientNotExistError } from '@cosmos-kit/core';
// import { Keplr, Window as KeplrWindow } from '@keplr-wallet/types';

export const getShellFromExtension = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }
  const shell = window.shellwallet;
  if (shell) {
    return shell;
  }
  if (document.readyState === 'complete') {
    if (shell) {
      return shell;
    } else {
      throw ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = event => {
      if (event.target && event.target.readyState === 'complete') {
        if (shell) {
          resolve(shell);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };
    document.addEventListener('readystatechange', documentStateChange);
  });
};