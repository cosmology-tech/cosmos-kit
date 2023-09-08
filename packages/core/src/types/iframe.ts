import { SignType } from './common';

export type IframeToParentMessage = {
  id: number;

  method: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any[];
  // For signer messages.
  chainId?: string;
  signType?: SignType;
};

export type ParentToIframeMessage = {
  id: number;
} & (
  | {
      type: 'success';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response: any;
      error?: undefined;
    }
  | {
      type: 'error';
      error: string;
      response?: undefined;
    }
);

export const IFRAME_WALLET_ID = 'iframe';
export const IFRAME_KEYSTORECHANGE_EVENT = 'iframe_keystorechange';
export const IFRAME_PARENT_DISCONNECTED = 'Parent wallet not connected.';
