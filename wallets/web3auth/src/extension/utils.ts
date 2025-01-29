import { sha256 } from '@cosmjs/crypto';
import { toUtf8 } from '@cosmjs/encoding';
import eccrypto, { Ecies } from '@toruslabs/eccrypto';
import { AuthAdapter, AuthLoginParams } from '@web3auth/auth-adapter';
import {
  ADAPTER_STATUS,
  CHAIN_NAMESPACES,
  CustomChainConfig,
  SafeEventEmitterProvider,
  UX_MODE,
  WALLET_ADAPTERS,
} from '@web3auth/base';
import { CommonPrivateKeyProvider } from '@web3auth/base-provider';
import { Web3AuthNoModal } from '@web3auth/no-modal';

import {
  FromWorkerMessage,
  ToWorkerMessage,
  Web3AuthClientOptions,
} from './types';

// If we connect to the Web3Auth client via redirect, set this key in
// localStorage to indicate that we should try to reconnect to this wallet
// after the redirect. This should be implemented by the WalletManagerProvider.
export const WEB3AUTH_REDIRECT_AUTO_CONNECT_KEY =
  '__cosmos-kit_web3auth_redirect_auto_connect';

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
export const hashObject = (object: any) => {
  const replacer = (_: string, value: any) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  };

  return Buffer.from(sha256(toUtf8(JSON.stringify(object, replacer))));
};

export const connectClientAndProvider = async (
  isMobile: boolean,
  options: Web3AuthClientOptions,
  { dontAttemptLogin = false } = {}
): Promise<{
  client: Web3AuthNoModal;
  provider: SafeEventEmitterProvider | null;
}> => {
  const chainConfig: CustomChainConfig = {
    chainId: 'other',
    rpcTarget: 'other',
    displayName: 'other',
    blockExplorerUrl: 'other',
    ticker: 'other',
    tickerName: 'other',
    ...options.client.chainConfig,
    chainNamespace: CHAIN_NAMESPACES.OTHER,
  };
  const privateKeyProvider = new CommonPrivateKeyProvider({
    config: {
      chainConfig,
    },
  });
  const client = new Web3AuthNoModal({
    ...options.client,
    chainConfig,
    privateKeyProvider,
  });

  // Popups are blocked by default on mobile browsers, so use redirect. Popup is
  // safer for desktop browsers, so use that if not mobile.
  const uxMode =
    options.forceType === 'redirect' || (isMobile && !options.forceType)
      ? UX_MODE.REDIRECT
      : UX_MODE.POPUP;
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

  const mfaLevel = options.mfaLevel ?? 'default';
  const authAdapter = new AuthAdapter({
    adapterSettings: {
      uxMode,
    },
    loginSettings: {
      mfaLevel,
    },
  });
  client.configureAdapter(authAdapter);

  await client.init();

  let provider = client.connected ? client.provider : null;
  if (!client.connected && !dontAttemptLogin) {
    try {
      const loginHint = options.getLoginHint?.();
      provider = await client.connectTo(WALLET_ADAPTERS.AUTH, {
        loginProvider: options.loginProvider,
        login_hint: loginHint,
      } as AuthLoginParams);
    } catch (err) {
      // Unnecessary error thrown during redirect, so log and ignore it.
      if (
        usingRedirect &&
        err instanceof Error &&
        err.message.includes('null')
      ) {
        console.error(err);
      } else {
        // Rethrow all other relevant errors.
        throw err;
      }
    }
  }

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

  return { client, provider };
};
