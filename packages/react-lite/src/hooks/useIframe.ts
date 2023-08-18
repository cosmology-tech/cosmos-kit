import { OfflineAminoSigner } from '@cosmjs/amino';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import {
  IFRAME_KEYSTORECHANGE_EVENT,
  IFRAME_PARENT_DISCONNECTED,
  IframeToParentMessage,
  ParentToIframeMessage,
  WalletClient,
} from '@cosmos-kit/core';
import { RefCallback, useCallback, useEffect, useState } from 'react';

import { useConnectedWallet } from './useConnectedWallet';

export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];

export type UseIframeOptions = {
  // If returns true, it was handled by us and an error will be thrown to the
  // iframe wallet.
  walletClientOverrides?: Partial<{
    [K in FunctionKeys<WalletClient>]: (
      ...params: Parameters<WalletClient[K]>
    ) => boolean | Promise<boolean>;
  }>;
  aminoSignerOverrides?: Partial<{
    [K in keyof OfflineAminoSigner]: (
      ...params: Parameters<OfflineAminoSigner[K]>
    ) => boolean | Promise<boolean>;
  }>;
  directSignerOverrides?: Partial<{
    [K in keyof OfflineDirectSigner]: (
      ...params: Parameters<OfflineDirectSigner[K]>
    ) => boolean | Promise<boolean>;
  }>;
};

export const useIframe = ({
  walletClientOverrides,
  aminoSignerOverrides,
  directSignerOverrides,
}: UseIframeOptions = {}): RefCallback<HTMLIFrameElement | null> => {
  const wallet = useConnectedWallet();
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);

  // Broadcast keystore change event to iframe wallet.
  useEffect(() => {
    if (!wallet || typeof window === 'undefined') {
      return;
    }

    const notifyIframe = () => {
      iframe?.contentWindow.dispatchEvent(
        new Event(IFRAME_KEYSTORECHANGE_EVENT)
      );
    };

    wallet.walletInfo.connectEventNamesOnWindow?.forEach((eventName) => {
      window.addEventListener(eventName, notifyIframe);
    });
    wallet.walletInfo.connectEventNamesOnClient?.forEach(async (eventName) => {
      wallet.client?.on?.(eventName, notifyIframe);
    });

    return () => {
      wallet.walletInfo.connectEventNamesOnWindow?.forEach((eventName) => {
        window.removeEventListener(eventName, notifyIframe);
      });
      wallet.walletInfo.connectEventNamesOnClient?.forEach(
        async (eventName) => {
          wallet.client?.off?.(eventName, notifyIframe);
        }
      );
    };
  }, [wallet, iframe]);

  // Whenever wallet changes, broadcast keystore change event to iframe wallet.
  useEffect(() => {
    iframe?.contentWindow.dispatchEvent(new Event(IFRAME_KEYSTORECHANGE_EVENT));
  }, [wallet, iframe]);

  useEffect(() => {
    if (!iframe) {
      return;
    }

    const listener = async (event: MessageEvent<IframeToParentMessage>) => {
      if (event.source !== iframe.contentWindow) {
        return;
      }

      if (
        'id' in event.data &&
        'method' in event.data &&
        'params' in event.data
      ) {
        const { id, method, params } = event.data;

        let msg: Omit<ParentToIframeMessage, 'id'> | undefined;
        try {
          if (!wallet) {
            throw new Error(IFRAME_PARENT_DISCONNECTED);
          }

          const { client } = wallet;

          if (method.startsWith('signer:')) {
            if (!event.data.chainId || !event.data.signType) {
              throw new Error('Missing chainId or signType');
            }

            const signer =
              event.data.signType === 'direct'
                ? await client.getOfflineSignerDirect(event.data.chainId)
                : await client.getOfflineSignerAmino(event.data.chainId);
            const subMethod = method.substring('signer:'.length);
            if (
              !(subMethod in signer) ||
              typeof signer[subMethod] !== 'function'
            ) {
              throw new Error(
                `No ${subMethod} ${event.data.signType} signer method for ${event.data.chainId}.`
              );
            }

            // Try to run override method, and throw error back to iframe if the
            // override handles it.
            if (
              (event.data.signType === 'amino' &&
                subMethod in aminoSignerOverrides &&
                (await aminoSignerOverrides[subMethod](...params))) ||
              (event.data.signType === 'direct' &&
                subMethod in directSignerOverrides &&
                (await directSignerOverrides[subMethod](...params)))
            ) {
              msg = {
                type: 'error',
                // TODO: improve message? or handling?
                error: 'Handled by outer wallet.',
              };
            } else {
              msg = {
                type: 'success',
                response: await signer[subMethod](...params),
              };
            }
          } else {
            // Try to run override method, and throw error back to iframe if the
            // override handles it.
            if (
              method in walletClientOverrides &&
              (await walletClientOverrides[method](...params))
            ) {
              msg = {
                type: 'error',
                // TODO: improve message? or handling?
                error: 'Handled by outer wallet.',
              };
            } else {
              let response =
                method in client && typeof client[method] === 'function'
                  ? await client[method](...params)
                  : undefined;

              // Respond with connected wallet info on successful connect.
              if (method === 'connect') {
                response = {
                  prettyName: wallet.walletInfo.prettyName,
                  logo: wallet.walletInfo.logo,
                };
              }

              msg = {
                type: 'success',
                response,
              };
            }
          }
        } catch (err) {
          msg = {
            type: 'error',
            error: err instanceof Error ? err.message : `${err}`,
          };
        }

        iframe.contentWindow.postMessage(
          {
            ...msg,
            id,
          },
          '*'
        );
      }
    };

    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, [iframe, wallet]);

  const refCallback: RefCallback<HTMLIFrameElement | null> = useCallback(
    (iframe) => setIframe(iframe),
    []
  );

  return refCallback;
};
