import {
  prepareInitialState,
  cleanUpOnDisconnect,
  requestWalletConnect,
  enableWallet,
  cleanUpWalletConnect,
  subscribeToKeplrWalletChange,
} from "./services";
import { walletMachineInitialContext } from "./context";
import { WalletMachineContextType, WalletMachineEvent } from "./types";
import {
  assignConnectedWallet,
  assignErrorState,
  assignReceivedWalletConnectInstance,
  assignReceivedWalletConnectURI,
  assignSelectedWallet,
  cleanUpConnectedWalletState,
  cleanUpWalletConnectURI,
} from "./actions";
import {
  isConnectedToWalletExtension,
  shouldHaveWalletConnectReadyForConnecting,
  shouldHaveWalletConnectUri,
  shouldSelectWalletConnect,
  shouldSelectWalletConnectMobile,
  shouldSelectWalletExtension,
} from "./guards";
import { createMachine } from "xstate";

export const walletMachine = createMachine(
  {
    id: "wallet-machine",
    initial: "validatingIfCanAutoConnect",
    schema: {
      context: {} as WalletMachineContextType,
      events: {} as WalletMachineEvent,
    },
    context: walletMachineInitialContext,
    states: {
      validatingIfCanAutoConnect: {
        meta: {
          description: "Validate if the wallet can be connected automatically",
        },
        invoke: {
          src: "prepareInitialState",
          onError: "selecting",
        },
        on: {
          RECEIVED_INITIAL_STATE: [
            {
              target: "enabling",
              actions: "assignSelectedWallet",
              cond: "shouldSelectWalletExtension",
            },
            {
              target: "connecting.walletConnectMobile",
              actions: "assignSelectedWallet",
              cond: "shouldSelectWalletConnectMobile",
            },
            {
              target: "connecting.walletConnect",
              actions: "assignSelectedWallet",
              cond: "shouldSelectWalletConnect",
            },
            {
              target: "selecting",
            },
          ],
        },
      },
      selecting: {
        on: {
          SELECT_WALLET: [
            {
              target: "connecting.walletConnectMobile",
              actions: "assignSelectedWallet",
              cond: "shouldSelectWalletConnectMobile",
            },
            {
              target: "connecting.walletConnect",
              actions: "assignSelectedWallet",
              cond: "shouldSelectWalletConnect",
            },
            {
              target: "connecting.extension",
              actions: "assignSelectedWallet",
            },
          ],
        },
      },
      connecting: {
        states: {
          walletConnect: {
            initial: "requesting",
            states: {
              requesting: {
                initial: "idle",
                invoke: {
                  src: "requestWalletConnect",
                  onDone: {
                    target: "#wallet-machine.enabling",
                    cond: "shouldHaveWalletConnectReadyForConnecting",
                  },
                  onError: {
                    target: "errored",
                    actions: "assignErrorState",
                  },
                },
                states: {
                  idle: {},
                  showsQrCode: {},
                },
                on: {
                  RECEIVE_WALLET_CONNECT_URI: {
                    target: ".showsQrCode",
                    actions: "assignReceivedWalletConnectURI",
                  },
                  REQUEST_WALLET_CONNECT_FULFILLED: {
                    target: "#wallet-machine.enabling",
                    actions: "assignReceivedWalletConnectInstance",
                  },
                },
              },
              errored: {
                on: {
                  RESET: "requesting",
                },
              },
            },
          },
          walletConnectMobile: {
            initial: "requesting",
            on: {
              NAVIGATE_TO_WALLET_CONNECT_APP: {
                target: "walletConnectMobile.approving",
                cond: "shouldHaveWalletConnectUri",
              },
              RECEIVE_WALLET_CONNECT_URI: {
                target: ".approving",
                actions: "assignReceivedWalletConnectURI",
              },
              REQUEST_WALLET_CONNECT_FULFILLED: {
                target: "#wallet-machine.enabling",
                actions: "assignReceivedWalletConnectInstance",
              },
            },
            states: {
              requesting: {
                invoke: {
                  src: "requestWalletConnect",
                  onDone: {
                    target: "received",
                    cond: "shouldHaveWalletConnectReadyForConnecting",
                  },
                  onError: {
                    target: "errored",
                    actions: "assignErrorState",
                  },
                },
              },
              received: {
                after: {
                  2000: "approving",
                },
              },
              approving: {
                invoke: {
                  src: "NAVIGATE_TO_WALLET_CONNECT_APP",
                  onError: {
                    target: "errored",
                    actions: "assignErrorState",
                  },
                },
                on: {
                  CONNECTED: "approved",
                },
              },
              approved: {
                always: "#wallet-machine.enabling",
              },
              errored: {
                on: {
                  RESET: "requesting",
                },
              },
            },
          },
          extension: {
            always: "#wallet-machine.enabling",
          },
        },
      },
      enabling: {
        invoke: {
          src: "enableWallet",
          onError: {
            target: "errored",
            actions: "assignErrorState",
          },
        },
        on: {
          WALLET_ENABLE: {
            target: "connected",
            actions: "assignConnectedWallet",
          },
        },
      },
      errored: {
        entry: "cleanUpWalletConnect",
        type: "final",
        on: {
          RESET: [
            {
              target: "enabling",
            },
          ],
        },
      },
      connected: {
        entry: ["cleanUpWalletConnectURI", "cleanUpWalletConnect"],
        invoke: {
          src: "subscribeToKeplrWalletChange",
        },
        on: {
          DISCONNECT: {
            target: "selecting",
            actions: ["cleanUpConnectedWalletState", "cleanUpOnDisconnect"],
          },
          RECONNECT: [
            /* todo: add reconnect for other wallets */
            {
              target: "connecting.extension",
              cond: "isConnectedToWalletExtension",
            },
          ],
        },
      },
    },
  },
  {
    guards: {
      shouldSelectWalletExtension,
      shouldSelectWalletConnect,
      shouldSelectWalletConnectMobile,
      shouldHaveWalletConnectReadyForConnecting,
      shouldHaveWalletConnectUri,
      isConnectedToWalletExtension,
    },
    services: {
      prepareInitialState,
      cleanUpOnDisconnect,
      requestWalletConnect,
      enableWallet,
      subscribeToKeplrWalletChange,
    },
    actions: {
      RESET: () => {},
      SELECT_WALLET: () => {},
      CANCEL_CONNECTION: () => {},
      NAVIGATE_TO_WALLET_CONNECT_APP: () => {},
      NAVIGATE_TO_INSTALL_APP: () => {},
      cleanUpWalletConnectURI,
      cleanUpConnectedWalletState,
      assignReceivedWalletConnectInstance,
      assignConnectedWallet,
      assignSelectedWallet,
      assignErrorState,
      assignReceivedWalletConnectURI,
      cleanUpWalletConnect,
    },
  }
);
