import { sha256 } from '@cosmjs/crypto';
import { toUtf8 } from '@cosmjs/encoding';
import eccrypto, { Ecies } from '@toruslabs/eccrypto';
import { UX_MODE } from '@toruslabs/openlogin';
import {
  ADAPTER_STATUS,
  CHAIN_NAMESPACES,
  SafeEventEmitterProvider,
  WALLET_ADAPTERS,
} from '@web3auth/base';
import { Web3AuthNoModal } from '@web3auth/no-modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';

import {
  FromWorkerMessage,
  ToWorkerMessage,
  Web3AuthClientOptions,
} from './types';

// If we connect to the Web3Auth client via redirect, set this key in
// localStorage to indicate that we should try to reconnect to this wallet
// after the redirect. This should be implemented by the WalletManagerProvider.
export const WEB3AUTH_REDIRECT_AUTO_CONNECT_KEY =
  '__cosmodal_web3auth_redirect_auto_connect';

// In case these get overwritten by an attacker.
const postMessage =
  typeof Worker !== 'undefined' ? Worker.prototype.postMessage : undefined;
const addEventListener =
  typeof Worker !== 'undefined' ? Worker.prototype.addEventListener : undefined;
const removeEventListener =
  typeof Worker !== 'undefined'
    ? Worker.prototype.removeEventListener
    : undefined;

// Listen for a message and remove the listener if the callback returns true or
// if it throws an error.
export const listenOnce = (
  worker: Worker,
  callback: (message: FromWorkerMessage) => boolean | Promise<boolean>
) => {
  const listener = async ({ data }: MessageEvent<FromWorkerMessage>) => {
    let remove;
    try {
      remove = await callback(data);
    } catch (error) {
      console.error(error);
      remove = true;
    }

    if (remove) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      removeEventListener?.call(worker, 'message', listener as any);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addEventListener?.call(worker, 'message', listener as any);
};

// Send message to worker and listen for a response. Returns a promise that
// resolves when the callback returns true and rejects if it throws an error.
export const sendAndListenOnce = (
  worker: Worker,
  message: ToWorkerMessage,
  callback: (message: FromWorkerMessage) => boolean | Promise<boolean>
): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    listenOnce(worker, async (data) => {
      try {
        if (await callback(data)) {
          resolve();
          return true;
        } else {
          return false;
        }
      } catch (err) {
        reject(err);
        return true;
      }
    });

    postMessage?.call(worker, message);
  });

export const decrypt = async (
  privateKey: Uint8Array | Buffer,
  { iv, ephemPublicKey, ciphertext, mac }: Ecies
): Promise<Buffer> =>
  await eccrypto.decrypt(
    Buffer.from(privateKey),
    // Convert Uint8Array to Buffer.
    {
      iv: Buffer.from(iv),
      ephemPublicKey: Buffer.from(ephemPublicKey),
      ciphertext: Buffer.from(ciphertext),
      mac: Buffer.from(mac),
    }
  );

// Used for signing and verifying objects.
export const hashObject = (object: unknown): Buffer =>
  Buffer.from(sha256(toUtf8(JSON.stringify(object))));

export const connectClientAndProvider = async (
  isMobile: boolean,
  options: Web3AuthClientOptions,
  {
    // If no login provider already connected (cached), don't attempt to login
    // by showing the popup auth flow. This is useful for connecting just to
    // logout of the session, not prompting to login if already logged out.
    dontAttemptLogin = false,
  } = {}
): Promise<{
  client: Web3AuthNoModal;
  provider: SafeEventEmitterProvider | null;
}> => {
  const client = new Web3AuthNoModal({
    ...options.client,
    chainConfig: {
      ...options.client.chainConfig,
      chainNamespace: CHAIN_NAMESPACES.OTHER,
    },
  });

  // Popups are blocked by default on mobile browsers, so use redirect. Popup is
  // safer for desktop browsers, so use that if not mobile.
  const uxMode =
    isMobile && !options.forcePopup ? UX_MODE.REDIRECT : UX_MODE.POPUP;
  // If using redirect method while trying to login, set localStorage key
  // indicating that we should try to reconnect to this wallet after the
  // redirect on library init.
  const usingRedirect = uxMode === UX_MODE.REDIRECT && !dontAttemptLogin;
  if (usingRedirect) {
    localStorage.setItem(
      WEB3AUTH_REDIRECT_AUTO_CONNECT_KEY,
      options.loginProvider
    );
  }

  const openloginAdapter = new OpenloginAdapter({
    adapterSettings: {
      uxMode,
      // Setting both to empty strings prevents the popup from opening when
      // attempted, ensuring no login attempt is made. Essentially, this makes
      // the `connectTo` method called on the client below throw an error if a
      // session is not already logged in and cached.
      ...(dontAttemptLogin && {
        _startUrl: '',
        _popupUrl: '',
      }),
    },
  });
  client.configureAdapter(openloginAdapter);

  await client.init();

  const provider =
    client.provider ??
    (await client.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: options.loginProvider,
    }));

  if (usingRedirect) {
    if (client.status === ADAPTER_STATUS.CONNECTED) {
      // On successful connection from a redirect, remove the localStorage key
      // so we do not attempt to auto connect on the next page load.
      localStorage.removeItem(WEB3AUTH_REDIRECT_AUTO_CONNECT_KEY);
    } else {
      // If not yet connected but redirecting, hang to give the page time to
      // redirect without throwing any errors. After 30 seconds, throw a
      // timeout error because it should definitely have redirected by then.
      await new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Redirect timed out.')), 30000)
      );
    }
  }

  return {
    client,
    provider,
  };
};
