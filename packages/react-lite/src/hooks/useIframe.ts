import {
  IframeToParentMessage,
  ParentToIframeMessage,
  WalletStatus,
} from '@cosmos-kit/core';
import { RefCallback, useCallback, useEffect, useState } from 'react';

import { useWallet } from './useWallet';

export const useIframe = (): RefCallback<HTMLIFrameElement | null> => {
  const wallet = useWallet();
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!iframe) {
      return;
    }

    const listener = async (event: MessageEvent<IframeToParentMessage>) => {
      if (event.source !== iframe.contentWindow) {
        return;
      }

      console.log('parent received iframe message', event.data, wallet);

      if (
        'id' in event.data &&
        'method' in event.data &&
        'params' in event.data
      ) {
        const { id, method, params } = event.data;

        let msg: Omit<ParentToIframeMessage, 'id'> | undefined;
        try {
          if (wallet.status !== WalletStatus.Connected) {
            throw new Error(wallet.message || 'Parent wallet not connected.');
          }

          const { client } = wallet.mainWallet;
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
              throw new Error(`No ${subMethod} method`);
            }

            msg = {
              type: 'success',
              response: await signer[subMethod](...params),
            };
          } else {
            console.log(client, method, params);

            msg = {
              type: 'success',
              response:
                method in client && typeof client[method] === 'function'
                  ? await client[method](...params)
                  : undefined,
            };
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
