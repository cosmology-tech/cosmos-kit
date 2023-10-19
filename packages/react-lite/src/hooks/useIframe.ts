import { OfflineAminoSigner } from '@cosmjs/amino';
import { AccountData, OfflineDirectSigner } from '@cosmjs/proto-signing';
import {
  IFRAME_KEYSTORECHANGE_EVENT,
  IFRAME_PARENT_DISCONNECTED,
  IframeToParentMessage,
  MainWalletBase,
  ParentToIframeMessage,
  WalletClient,
  WalletName,
} from '@cosmos-kit/core';
import { RefCallback, useCallback, useEffect, useState } from 'react';

import { useWallet } from './useWallet';

export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];

export type Mutable<T> = {
  -readonly [k in keyof T]: T[k];
};

export type AccountReplacement = {
  address: string;
  username?: string;
  pubkey?: Uint8Array;
};

// Throw an error, defaulting to "Handled by outer wallet."
export type OverrideHandlerError = {
  type: 'error';
  error?: string;
};

// Return successfully with a specific value.
export type OverrideHandlerSuccess = {
  type: 'success';
  value: unknown;
};

// Execute the function normally.
export type OverrideHandlerExecute = {
  type: 'execute';
};

export type OverrideHandler =
  | OverrideHandlerError
  | OverrideHandlerSuccess
  | OverrideHandlerExecute
  // If nothing is returned, defaults to an error.
  | undefined
  | void;

export type UseIframeOptions = {
  walletName?: WalletName;
  // Optionally overrides the connected wallet metadata in the iframe upon
  // successful connection.
  walletInfo?: {
    prettyName?: string;
    logo?: string;
  };
  // If defined and returns a valid object, it will be used to replace the
  // account in functions that return account details, such as getAccounts and
  // getSimpleAccount.
  accountReplacement?: (
    chainId: string
  ) => AccountReplacement | Promise<AccountReplacement> | undefined;
  // If defined, the relevant override will be called with the parameters. The
  // return value determines how the iframe should handle the function. By
  // default, if nothing is returned, an error will be thrown with the message
  // "Handled by outer wallet."
  walletClientOverrides?: Partial<{
    [K in FunctionKeys<WalletClient>]: (
      ...params: Parameters<WalletClient[K]>
    ) => OverrideHandler | Promise<OverrideHandler>;
  }>;
  aminoSignerOverrides?: Partial<{
    [K in keyof OfflineAminoSigner]: (
      ...params: Parameters<OfflineAminoSigner[K]>
    ) => OverrideHandler | Promise<OverrideHandler>;
  }>;
  directSignerOverrides?: Partial<{
    [K in keyof OfflineDirectSigner]: (
      ...params: Parameters<OfflineDirectSigner[K]>
    ) => OverrideHandler | Promise<OverrideHandler>;
  }>;
};

export const useIframe = ({
  walletName,
  walletInfo,
  accountReplacement,
  walletClientOverrides,
  aminoSignerOverrides,
  directSignerOverrides,
}: UseIframeOptions = {}): {
  wallet: MainWalletBase;
  iframeRef: RefCallback<HTMLIFrameElement | null>;
} => {
  const wallet = useWallet(walletName).mainWallet;
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);

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
          if (method.startsWith('signer:')) {
            if (!event.data.chainId || !event.data.signType) {
              throw new Error('Missing chainId or signType');
            }

            const subMethod = method.substring('signer:'.length);

            // Try amino signer override method.
            if (
              aminoSignerOverrides &&
              event.data.signType === 'amino' &&
              subMethod in aminoSignerOverrides
            ) {
              const handledMsg = processOverrideHandler(
                await aminoSignerOverrides[subMethod](...params)
              );
              if (handledMsg) {
                msg = handledMsg;
              }
            }

            // Try direct signer override method.
            if (
              directSignerOverrides &&
              event.data.signType === 'direct' &&
              subMethod in directSignerOverrides
            ) {
              const handledMsg = processOverrideHandler(
                await directSignerOverrides[subMethod](...params)
              );
              if (handledMsg) {
                msg = handledMsg;
              }
            }

            // If neither override handles it, run the original method.
            if (!msg) {
              // If wallet not connected and no override, throw.
              if (!wallet) {
                throw new Error(IFRAME_PARENT_DISCONNECTED);
              }

              const signer =
                event.data.signType === 'direct'
                  ? await wallet.client.getOfflineSignerDirect(
                      event.data.chainId
                    )
                  : await wallet.client.getOfflineSignerAmino(
                      event.data.chainId
                    );
              if (
                !(subMethod in signer) ||
                typeof signer[subMethod] !== 'function'
              ) {
                throw new Error(
                  `No ${subMethod} ${event.data.signType} signer method for ${event.data.chainId}.`
                );
              }

              const response = await signer[subMethod](...params);

              // If getting accounts, replace address.
              if (subMethod === 'getAccounts' && accountReplacement) {
                const account = await accountReplacement(event.data.chainId);
                if (account) {
                  (response as Mutable<AccountData>[]).forEach(
                    (responseAccount) => {
                      responseAccount.address = account.address;
                      if (account.pubkey) {
                        responseAccount.pubkey = account.pubkey;
                      }
                    }
                  );
                }
              }

              msg = {
                type: 'success',
                response,
              };
            }
          } else {
            // Try override method.
            if (walletClientOverrides && method in walletClientOverrides) {
              const handledMsg = processOverrideHandler(
                await walletClientOverrides[method](...params)
              );
              if (handledMsg) {
                msg = handledMsg;
              }
            }

            // If no override handles it, run the original method.
            if (!msg) {
              // If wallet not connected and no override, throw.
              if (!wallet) {
                throw new Error(IFRAME_PARENT_DISCONNECTED);
              }

              const response =
                method in wallet.client &&
                typeof wallet.client[method] === 'function'
                  ? await wallet.client[method](...params)
                  : undefined;

              // If getting accounts, try to replace info.
              if (
                (method === 'getAccount' || method === 'getSimpleAccount') &&
                accountReplacement &&
                params.length === 1 &&
                typeof params[0] === 'string'
              ) {
                const account = await accountReplacement(params[0]);
                if (account) {
                  response.address = account.address;
                  if (account.username) {
                    response.username = account.username;
                  }
                  if (account.pubkey && response.pubkey) {
                    response.pubkey = account.pubkey;
                  }
                }
              }

              msg = {
                type: 'success',
                response,
              };
            }

            // Respond with parent wallet info on successful connect.
            if (msg.type === 'success' && method === 'connect') {
              msg.response = {
                prettyName:
                  walletInfo?.prettyName ||
                  `${wallet.walletInfo.prettyName} (Outer)`,
                logo: walletInfo?.logo || wallet.walletInfo.logo,
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

  const iframeRef: RefCallback<HTMLIFrameElement | null> = useCallback(
    (iframe) => setIframe(iframe),
    []
  );

  return {
    wallet,
    iframeRef,
  };
};

const processOverrideHandler = (
  handler: OverrideHandler
): Omit<ParentToIframeMessage, 'id'> | undefined => {
  if (!handler || handler.type === 'error') {
    return {
      type: 'error',
      error:
        (handler && handler.type === 'error' && handler.error) ||
        'Handled by outer wallet.',
    };
  } else if (handler.type === 'success') {
    return {
      type: 'success',
      response: handler.value,
    };
  }
};
