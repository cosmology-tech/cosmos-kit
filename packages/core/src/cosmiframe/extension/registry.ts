import {
  COSMIFRAME_KEYSTORECHANGE_EVENT,
  COSMIFRAME_WALLET_ID,
} from '../constants';
import { CosmiframeWalletInfo } from './types';

export const cosmiframeExtensionInfo: CosmiframeWalletInfo = {
  name: COSMIFRAME_WALLET_ID,
  prettyName: 'Cosmiframe',
  // A disconnected icon, since this should be overridden by the parent.
  logo: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGgKICAgIGZpbGw9IiM5MzkzOTMiCiAgICBkPSJNOC4xNCAxMC45NmMtLjA5LjMzLS4xNC42OC0uMTQgMS4wNCAwIDEuMS40NSAyLjEgMS4xNyAyLjgzbC0xLjQyIDEuNDJDNi42NyAxNS4xNiA2IDEzLjY2IDYgMTJjMC0uOTMuMjEtMS44LjU4LTIuNTlMNS4xMSA3Ljk0QzQuNCA5LjEzIDQgMTAuNTIgNCAxMmMwIDIuMjEuOSA0LjIxIDIuMzUgNS42NWwtMS40MiAxLjQyQzMuMTIgMTcuMjYgMiAxNC43NiAyIDEyYzAtMi4wNC42MS0zLjkzIDEuNjYtNS41MUwxLjM5IDQuMjIgMi44IDIuODFsMTguMzggMTguMzgtMS40MSAxLjQxTDguMTQgMTAuOTZ6bTkuMjggMy42M2MuMzctLjc5LjU4LTEuNjYuNTgtMi41OSAwLTEuNjYtLjY3LTMuMTYtMS43Ni00LjI0bC0xLjQyIDEuNDJDMTUuNTUgOS45IDE2IDEwLjkgMTYgMTJjMCAuMzYtLjA1LjcxLS4xNCAxLjA0bDEuNTYgMS41NXpNMjAgMTJjMCAxLjQ4LS40IDIuODctMS4xMSA0LjA2bDEuNDUgMS40NUMyMS4zOSAxNS45MyAyMiAxNC4wNCAyMiAxMmMwLTIuNzYtMS4xMi01LjI2LTIuOTMtNy4wN2wtMS40MiAxLjQyQzE5LjEgNy43OSAyMCA5Ljc5IDIwIDEyeiI+PC9wYXRoPgo8L3N2Zz4=',
  mode: 'extension',
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  connectEventNamesOnWindow: [COSMIFRAME_KEYSTORECHANGE_EVENT],
  // This will be overridden by the `makeCosmiframeWallet` function.
  allowedParentOrigins: [],
};
