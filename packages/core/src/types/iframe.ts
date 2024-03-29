import { SignType } from './common';

export type IframeToParentMessage = {
  id: string;

  method: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any[];
  // For signer messages.
  chainId?: string;
  signType?: SignType;
};

export type ParentToIframeMessage = {
  id: string;
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

// The message sent to register or unregister an event listener on the parent.
export type EventListenerIframeMessage = {
  id: string;
  type: string;
};

export const IFRAME_WALLET_ID = 'iframe';
export const IFRAME_KEYSTORECHANGE_EVENT = 'iframe_keystorechange';
export const IFRAME_PARENT_DISCONNECTED = 'Outer wallet not connected.';
export const IFRAME_DEFAULT_PRETTY_NAME = 'Outer Wallet';
export const IFRAME_DEFAULT_LOGO =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGgKICAgIGZpbGw9IiM5MzkzOTMiCiAgICBkPSJNOC4xNCAxMC45NmMtLjA5LjMzLS4xNC42OC0uMTQgMS4wNCAwIDEuMS40NSAyLjEgMS4xNyAyLjgzbC0xLjQyIDEuNDJDNi42NyAxNS4xNiA2IDEzLjY2IDYgMTJjMC0uOTMuMjEtMS44LjU4LTIuNTlMNS4xMSA3Ljk0QzQuNCA5LjEzIDQgMTAuNTIgNCAxMmMwIDIuMjEuOSA0LjIxIDIuMzUgNS42NWwtMS40MiAxLjQyQzMuMTIgMTcuMjYgMiAxNC43NiAyIDEyYzAtMi4wNC42MS0zLjkzIDEuNjYtNS41MUwxLjM5IDQuMjIgMi44IDIuODFsMTguMzggMTguMzgtMS40MSAxLjQxTDguMTQgMTAuOTZ6bTkuMjggMy42M2MuMzctLjc5LjU4LTEuNjYuNTgtMi41OSAwLTEuNjYtLjY3LTMuMTYtMS43Ni00LjI0bC0xLjQyIDEuNDJDMTUuNTUgOS45IDE2IDEwLjkgMTYgMTJjMCAuMzYtLjA1LjcxLS4xNCAxLjA0bDEuNTYgMS41NXpNMjAgMTJjMCAxLjQ4LS40IDIuODctMS4xMSA0LjA2bDEuNDUgMS40NUMyMS4zOSAxNS45MyAyMiAxNC4wNCAyMiAxMmMwLTIuNzYtMS4xMi01LjI2LTIuOTMtNy4wN2wtMS40MiAxLjQyQzE5LjEgNy43OSAyMCA5Ljc5IDIwIDEyeiI+PC9wYXRoPgo8L3N2Zz4=';
