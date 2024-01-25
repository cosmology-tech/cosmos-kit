import { OfflineAminoSigner } from '@cosmjs/amino';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import { ClientNotExistError } from '@cosmos-kit/core';
// @ts-ignore
import { SecretUtils } from 'secretjs/types/enigmautils';

// import { Keplr, Window as KeplrWindow } from '@keplr-wallet/types';
import { Shell } from './types';

export interface ShellWindow {
  shellwallet?: Shell;
  getOfflineSigner?: (
    chainId: string
  ) => OfflineAminoSigner & OfflineDirectSigner;
  getOfflineSignerOnlyAmino?: (chainId: string) => OfflineAminoSigner;
  getOfflineSignerAuto?: (
    chainId: string
  ) => Promise<OfflineAminoSigner | OfflineDirectSigner>;
  getEnigmaUtils?: (chainId: string) => SecretUtils;
}

export const getShellFromExtension: () => Promise<
  Shell | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return void 0;
  }

  const shell = (window as ShellWindow).shellwallet;

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
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === 'complete'
      ) {
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
