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
