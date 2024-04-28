import { OfflineAminoSigner } from '@cosmjs/amino';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import {
  IFRAME_KEYSTORECHANGE_EVENT,
  IFRAME_PARENT_DISCONNECTED,
  MainWalletBase,
  WalletClient,
  WalletName,
} from '@cosmos-kit/core';
import { Cosmiframe, OverrideHandler } from '@dao-dao/cosmiframe';
import { RefCallback, useCallback, useEffect, useRef, useState } from 'react';

import { useWallet } from './useWallet';

export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];

export type UseIframeOptions = {
  walletName?: WalletName;
  // Optionally overrides the connected wallet metadata in the iframe upon
  // successful connection.
  walletInfo?: {
    prettyName?: string;
    logo?: string;
  };
  // If defined, the relevant override will be called with the parameters. The
  // return value determines how the iframe should handle the function. By
  // default, if nothing is returned, an error will be thrown with the message
  // "Handled by outer wallet."
  walletClientOverrides?: Partial<{
    [K in FunctionKeys<WalletClient>]: (
      ...params: Parameters<WalletClient[K]>
    ) => OverrideHandler | Promise<OverrideHandler>;
  }>;
  signerOverrides?: Partial<{
    [K in keyof (OfflineAminoSigner & OfflineDirectSigner)]: (
      ...params: Parameters<(OfflineAminoSigner & OfflineDirectSigner)[K]>
    ) => OverrideHandler | Promise<OverrideHandler>;
  }>;
};

export const useIframe = ({
  walletName,
  walletInfo,
  walletClientOverrides,
  signerOverrides,
}: UseIframeOptions = {}): {
  wallet: MainWalletBase;
  iframeRef: RefCallback<HTMLIFrameElement | null>;
} => {
  const wallet = useWallet(walletName).mainWallet;
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);

  const [cosmiframe] = useState(() => new Cosmiframe());
  // Memoize these values with refs so the listener always uses their latest
  // values without needing to reset.
  const walletClientOverridesRef = useRef(walletClientOverrides);
  walletClientOverridesRef.current = walletClientOverrides;
  const signerOverridesRef = useRef(signerOverrides);
  signerOverridesRef.current = signerOverrides;

  // Broadcast keystore change event to iframe wallet.
  useEffect(() => {
    const notifyIframe = () => {
      iframe?.contentWindow.postMessage(
        {
          event: IFRAME_KEYSTORECHANGE_EVENT,
        },
        '*'
      );
    };

    // Notify inner window of keystore change on any wallet client change
    // (likely either connection or disconnection).
    notifyIframe();

    if (!wallet || typeof window === 'undefined') {
      return;
    }

    // Notify inner window of keystore change on any wallet connect event.
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
    iframe?.contentWindow.postMessage(
      {
        event: IFRAME_KEYSTORECHANGE_EVENT,
      },
      '*'
    );
  }, [wallet, iframe]);

  useEffect(() => {
    if (!iframe) {
      return;
    }

    const removeListener = cosmiframe.listen({
      iframe,
      target: wallet?.client || {},
      getOfflineSignerDirect:
        wallet?.client.getOfflineSignerDirect.bind(wallet.client) ||
        (() => Promise.reject(IFRAME_PARENT_DISCONNECTED)),
      getOfflineSignerAmino:
        wallet?.client.getOfflineSignerAmino.bind(wallet.client) ||
        (() => Promise.reject(IFRAME_PARENT_DISCONNECTED)),
      nonSignerOverrides: () => ({
        ...walletClientOverridesRef.current,
        // Override connect to return wallet info.
        connect: async (...params) => {
          // In case override handler is successful, merge value.
          let handlerSuccessValue;
          if (walletClientOverridesRef.current?.connect) {
            const handler = await walletClientOverridesRef.current.connect(
              params[0],
              params[1]
            );
            // If not successful, return the handler as-is. Otherwise, continue
            // on to respond with wallet info.
            if (!handler || handler.type !== 'success') {
              return handler;
            }
            handlerSuccessValue = handler.value;
          } else if (wallet?.client?.connect) {
            await wallet.client.connect(params[0], params[1]);
          } else {
            return {
              type: 'error',
              error: IFRAME_PARENT_DISCONNECTED,
            };
          }

          // Respond with parent wallet info on successful connection.
          return {
            type: 'success',
            value: {
              // In case override handler returns a value, merge with internal
              // wallet info.
              ...handlerSuccessValue,
              _cosmosKit: {
                prettyName:
                  walletInfo?.prettyName ||
                  `${wallet.walletInfo.prettyName} (Outer Wallet)`,
                logo: walletInfo?.logo || wallet.walletInfo.logo,
              },
            },
          };
        },
      }),
      signerOverrides: () => signerOverridesRef.current,
    });

    return removeListener;
  }, [iframe, wallet, walletInfo]);

  const iframeRef: RefCallback<HTMLIFrameElement | null> = useCallback(
    (iframe) => setIframe(iframe),
    []
  );

  return {
    wallet,
    iframeRef,
  };
};
