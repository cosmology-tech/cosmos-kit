import {
  prepareInitialState,
  requestWalletConnect,
  enableWallet,
  subscribeToKeplrWalletChange,
} from './services'
import { walletMachineInitialContext } from './context'
import { WalletMachineContextType, WalletMachineEvent } from './types'
import {
  assignConnectedWallet,
  assignErrorState,
  assignReceivedWalletConnectInstance,
  assignReceivedWalletConnectURI,
  assignSelectedWallet,
  cleanUpConnectedWalletState,
  cleanUpWalletConnectURI,
  clearWalletTypeInStorage,
  updateWalletTypeInStorage,
  cleanUpWalletConnect,
  killWalletConnectSession,
  navigateToWalletConnectApp,
} from './actions'
import {
  isConnectedToWalletExtension,
  shouldHaveWalletConnectReadyForConnecting,
  shouldHaveWalletConnectUri,
  shouldSelectWalletConnect,
  shouldSelectWalletConnectMobile,
  shouldSelectWalletExtension,
} from './guards'
import { createMachine } from 'xstate'

export const walletMachine = createMachine(
  {
    id: 'wallet-machine',
    initial: 'validatingIfCanAutoConnect',
    schema: {
      context: {} as WalletMachineContextType,
      events: {} as WalletMachineEvent,
    },
    context: walletMachineInitialContext,
    states: {
      validatingIfCanAutoConnect: {
        meta: {
          description: 'Validate if the wallet can be connected automatically',
        },
        invoke: {
          src: 'prepareInitialState',
          onError: {
            target: 'selecting',
            actions: 'clearWalletTypeInStorage',
          },
        },
        on: {
          RECEIVED_INITIAL_STATE: [
            {
              target: 'enabling',
              actions: 'assignSelectedWallet',
              cond: 'shouldSelectWalletExtension',
            },
            {
              target: 'connecting.walletConnectMobile',
              actions: 'assignSelectedWallet',
              cond: 'shouldSelectWalletConnectMobile',
            },
            {
              target: 'connecting.walletConnect',
              actions: 'assignSelectedWallet',
              cond: 'shouldSelectWalletConnect',
            },
            {
              target: 'selecting',
            },
          ],
        },
      },
      selecting: {
        on: {
          SELECT_WALLET: [
            {
              target: 'connecting.walletConnectMobile',
              actions: 'assignSelectedWallet',
              cond: 'shouldSelectWalletConnectMobile',
            },
            {
              target: 'connecting.walletConnect',
              actions: 'assignSelectedWallet',
              cond: 'shouldSelectWalletConnect',
            },
            {
              target: 'connecting.extension',
              actions: 'assignSelectedWallet',
            },
          ],
        },
      },
      connecting: {
        states: {
          walletConnect: {
            initial: 'requesting',
            on: {
              RESET: {
                target: '.requesting',
                actions: [
                  'cleanUpConnectedWalletState',
                  'killWalletConnectSession',
                ],
              },
            },
            states: {
              requesting: {
                initial: 'idle',
                invoke: {
                  src: 'requestWalletConnect',
                  onDone: {
                    target: '#wallet-machine.enabling',
                    cond: 'shouldHaveWalletConnectReadyForConnecting',
                  },
                  onError: {
                    target: 'errored',
                    actions: 'assignErrorState',
                  },
                },
                states: {
                  idle: {},
                  showsQrCode: {},
                },
                on: {
                  RECEIVE_WALLET_CONNECT_URI: {
                    target: '.showsQrCode',
                    actions: 'assignReceivedWalletConnectURI',
                  },
                  REQUEST_WALLET_CONNECT_FULFILLED: {
                    target: '#wallet-machine.enabling',
                    actions: 'assignReceivedWalletConnectInstance',
                  },
                },
              },
              errored: {},
            },
          },
          walletConnectMobile: {
            initial: 'requesting',
            on: {
              NAVIGATE_TO_WALLET_CONNECT_APP: {
                target: 'walletConnectMobile.approving',
                cond: 'shouldHaveWalletConnectUri',
              },
              RECEIVE_WALLET_CONNECT_URI: {
                target: '.approving',
                actions: 'assignReceivedWalletConnectURI',
              },
              REQUEST_WALLET_CONNECT_FULFILLED: {
                target: '#wallet-machine.enabling',
                actions: 'assignReceivedWalletConnectInstance',
              },
              RESET: {
                target: '.requesting',
                actions: [
                  'cleanUpConnectedWalletState',
                  'killWalletConnectSession',
                ],
              },
            },
            states: {
              requesting: {
                invoke: {
                  src: 'requestWalletConnect',
                  onDone: {
                    target: 'received',
                    cond: 'shouldHaveWalletConnectReadyForConnecting',
                  },
                  onError: {
                    target: 'errored',
                    actions: 'assignErrorState',
                  },
                },
              },
              received: {
                after: {
                  2000: 'approving',
                },
              },
              approving: {
                entry: 'navigateToWalletConnectApp',
                on: {
                  CONNECTED: 'approved',
                },
              },
              approved: {
                always: '#wallet-machine.enabling',
              },
              errored: {
                on: {
                  RESET: 'requesting',
                },
              },
            },
          },
          extension: {
            always: '#wallet-machine.enabling',
          },
        },
      },
      enabling: {
        invoke: {
          src: 'enableWallet',
          onError: {
            target: 'errored',
            actions: 'assignErrorState',
          },
        },
        on: {
          WALLET_ENABLE: {
            target: 'connected',
            actions: 'assignConnectedWallet',
          },
        },
      },
      errored: {
        entry: 'cleanUpWalletConnect',
        type: 'final',
        on: {
          RESET: {
            target: 'enabling',
            actions: [
              'cleanUpConnectedWalletState',
              'killWalletConnectSession',
            ],
          },
        },
      },
      connected: {
        entry: [
          'cleanUpError',
          'cleanUpWalletConnectURI',
          'cleanUpWalletConnect',
          'updateWalletTypeInStorage',
        ],
        invoke: {
          src: 'subscribeToKeplrWalletChange',
        },
        states: {
          enabling: {
            invoke: {
              src: 'enableWallet',
              onError: 'errored',
            },
            entry: 'cleanUpError',
          },
          errored: {},
          enabled: {},
        },
        on: {
          DISCONNECT: {
            target: 'selecting',
            actions: [
              'cleanUpConnectedWalletState',
              'killWalletConnectSession',
              'clearWalletTypeInStorage',
              'cleanUpError',
            ],
          },
          RECONNECT: [
            /* todo: add reconnect for other wallets */
            {
              target: 'connecting.extension',
              cond: 'isConnectedToWalletExtension',
            },
          ],
          CONNECT_ADDITIONAL_CHAIN: {
            target: '.enabling',
          },
          WALLET_ENABLE: {
            target: '.enabled',
            actions: 'assignConnectedWallet',
          },
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
      requestWalletConnect,
      enableWallet,
      subscribeToKeplrWalletChange,
    },
    actions: {
      cleanUpWalletConnectURI,
      cleanUpConnectedWalletState,
      assignReceivedWalletConnectInstance,
      assignConnectedWallet,
      assignSelectedWallet,
      assignErrorState,
      assignReceivedWalletConnectURI,
      cleanUpWalletConnect,
      killWalletConnectSession,
      clearWalletTypeInStorage,
      updateWalletTypeInStorage,
      navigateToWalletConnectApp,
    },
  }
)
