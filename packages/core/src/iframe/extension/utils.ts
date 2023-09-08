import { sha256 } from '@cosmjs/crypto';
import { toUtf8 } from '@cosmjs/encoding';

import { IframeToParentMessage, ParentToIframeMessage } from '../../types';

// Listen for a message and remove the listener if the callback returns true or
// if it throws an error.
export const listenOnce = (
  callback: (message: ParentToIframeMessage) => boolean | Promise<boolean>
) => {
  const listener = async ({ data }: MessageEvent) => {
    let remove;
    try {
      remove = await callback(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      remove = true;
    }

    if (remove) {
      window.removeEventListener('message', listener);
    }
  };

  window.addEventListener('message', listener);
};

// Send message to parent and listen for a response. Returns a promise that
// resolves with the return value of the callback and rejects if the callback
// throws an error.
export const sendAndListenOnce = <T>(
  message: Omit<IframeToParentMessage, 'id'>,
  callback: (message: ParentToIframeMessage) => T
): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const id = Date.now();

    // Add one-time listener that waits for a response.
    listenOnce(async (data) => {
      // Verify we are receiving a response for the correct message.
      if (data.id !== id) {
        return false;
      }

      try {
        resolve(await callback(data));
      } catch (err) {
        reject(err);
        return true;
      }
      return true;
    });

    // Send the message to our parent.
    window.top.postMessage(
      {
        ...message,
        id,
      },
      '*'
    );
  });

// Used for signing and verifying objects.
export const hashObject = (object: unknown): Buffer =>
  Buffer.from(sha256(toUtf8(JSON.stringify(object))));
