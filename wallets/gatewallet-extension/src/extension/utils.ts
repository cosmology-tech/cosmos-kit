import { ClientNotExistError } from '@cosmos-kit/core';

import { Gatewallet } from './types';

interface GatewalltWindow {
  gatewallet?: GatewalletExtension;
}

interface GatewalletExtension {
  keplr?: Gatewallet;
}

export const getGatewalletFromExtension: () => Promise<
  Gatewallet | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const gatewallet = (window as GatewalltWindow).gatewallet?.keplr;

  if (gatewallet) {
    return gatewallet;
  }

  if (document.readyState === 'complete') {
    if (gatewallet) {
      return gatewallet;
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
        if (gatewallet) {
          resolve(gatewallet);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
