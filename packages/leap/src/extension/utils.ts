import { OfflineSigner } from '@cosmjs/launchpad';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';

import { Leap } from './types';

const error = new Error('No Leap extension installed!');

interface LeapWindow {
  leap?: Leap;
  getOfflineSigner?: (chainId: string) => OfflineSigner & OfflineDirectSigner;
  getOfflineSignerOnlyAmino?: (chainId: string) => OfflineSigner;
  getOfflineSignerAuto?: (
    chainId: string
  ) => Promise<OfflineSigner | OfflineDirectSigner>;
}

export const getLeapFromExtension: () => Promise<
  Leap | undefined
> = async () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const leap = (window as LeapWindow).leap;

  if (leap) {
    return leap;
  }

  if (document.readyState === 'complete') {
    if (leap) {
      return leap;
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
        if (leap) {
          resolve(leap);
        } else {
          reject(error.message);
        }
        document.removeEventListener('readystatechange', documentStateChange);
      }
    };

    document.addEventListener('readystatechange', documentStateChange);
  });
};
