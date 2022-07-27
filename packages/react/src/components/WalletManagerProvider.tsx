import { SigningCosmWasmClientOptions } from "@cosmjs/cosmwasm-stargate";
import { SigningStargateClientOptions } from "@cosmjs/stargate";
import { IClientMeta } from "@walletconnect/types";
import React, {
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  ChainInfoOverrides,
  ModalClassNames,
  SigningClientGetter,
  Wallet,
  WalletConnectionStatus,
  WalletType,
} from "../types";
import { Wallets } from "../utils";
import {
  BaseModal,
  EnablingWalletModal,
  SelectWalletModal,
  WalletConnectModal,
} from "./ui";
import { WalletManagerContext } from "./WalletManagerContext";
import { useMachine } from "@xstate/react";
import { walletMachine } from "../machine/machine";
import { WalletMachineContextType } from "../machine/types";

export type WalletManagerProviderProps = PropsWithChildren<{
  // Wallet types available for connection.
  enabledWalletTypes: WalletType[];
  // Chain ID to initially connect to and selected by default if nothing
  // is passed to the hook. Must be present in one of the objects in
  // `chainInfoList`.
  defaultChainId: string;
  // List or getter of additional or replacement ChainInfo objects. These
  // will take precedent over internal definitions by comparing `chainId`.
  chainInfoOverrides?: ChainInfoOverrides;
  // Class names applied to various components for custom theming.
  classNames?: ModalClassNames;
  // Custom close icon.
  closeIcon?: ReactNode;
  // Descriptive info about the webapp which gets displayed when enabling a
  // WalletConnect wallet (e.g. name, image, etc.).
  walletConnectClientMeta?: IClientMeta;
  // A custom loader to display in the modals, such as enabling the wallet.
  renderLoader?: () => ReactNode;
  // When set to a valid wallet type, the connect function will skip the
  // selection modal and attempt to connect to this wallet immediately.
  preselectedWalletType?: WalletType;
  // localStorage key for saving, loading, and auto connecting to a wallet.
  localStorageKey?: string;
  // Callback that will be attached as a listener to the
  // `keplr_keystorechange` event on the window object.
  onKeplrKeystoreChangeEvent?: (event: Event) => unknown;
  // Getter for options passed to SigningCosmWasmClient on connection.
  getSigningCosmWasmClientOptions?: SigningClientGetter<SigningCosmWasmClientOptions>;
  // Getter for options passed to SigningStargateClient on connection.
  getSigningStargateClientOptions?: SigningClientGetter<SigningStargateClientOptions>;
}>;

export const WalletManagerProvider: FunctionComponent<
  WalletManagerProviderProps
> = ({
  children,
  enabledWalletTypes,
  defaultChainId,
  chainInfoOverrides,
  classNames,
  closeIcon,
  renderLoader,
  walletConnectClientMeta,
  preselectedWalletType,
  localStorageKey,
  onKeplrKeystoreChangeEvent,
  getSigningCosmWasmClientOptions,
  getSigningStargateClientOptions,
}) => {
  //! STATE
  /* initialize context */
  const stateMachineContext = useMemo((): WalletMachineContextType => {
    return {
      ...walletMachine.context,
      enabledWallets: Wallets.filter(({ type }) =>
        enabledWalletTypes.includes(type)
      ),
      utils: {
        getSigningCosmWasmClientOptions,
        getSigningStargateClientOptions,
      },
      config: {
        localStorageKey,
        defaultChainId,
        chainInfoOverrides,
        walletConnectClientMeta,
        onKeplrKeystoreChangeEvent,
        preselectedWalletType,
      },
    };
  }, [
    localStorageKey,
    defaultChainId,
    chainInfoOverrides,
    getSigningCosmWasmClientOptions,
    getSigningStargateClientOptions,
    enabledWalletTypes,
  ]);

  const [state, send] = useMachine(walletMachine, {
    context: stateMachineContext,
  });

  const {
    enabledWallets,
    isEmbeddedKeplrMobileWeb,
    walletConnectUri,
    connectedWallet,
  } = state.context;

  console.log("**STATE**", state.value, "**CONTEXT**", state.context);

  // Modal State
  const [pickerModalOpen, setPickerModalOpen] = useState(false);
  const [walletEnableModalOpen, setWalletEnableModalOpen] = useState(false);

  // Disconnect from connected wallet.
  const disconnect = useCallback(() => {
    send("DISCONNECT");
  }, [send]);

  // Obtain WalletConnect if necessary, and connect to the wallet.
  const connectToWallet = useCallback(
    async (wallet: Wallet) => {
      send("SELECT_WALLET", { walletType: wallet.type });
    },
    [send]
  );

  // Begin connection process, either auto-selecting a wallet or opening
  // the selection modal.
  const beginConnection = useCallback(() => {
    // If no default wallet, open modal to choose one.
    setPickerModalOpen(true);
  }, [setPickerModalOpen]);

  // Initiate reset.
  const resetConnection = useCallback(async () => {
    send("RESET");
  }, [send]);

  // Memoize context data.
  const value = useMemo(
    () => ({
      connect: beginConnection,
      disconnect,
      connectedWallet,
      status: state.matches("connected")
        ? WalletConnectionStatus.Connected
        : WalletConnectionStatus.Initializing,
      connected: state.matches("connected"),
      error: state.context.error?.message,
      isEmbeddedKeplrMobileWeb,
      chainInfoOverrides,
      getSigningCosmWasmClientOptions,
      getSigningStargateClientOptions,
    }),
    [
      beginConnection,
      chainInfoOverrides,
      connectedWallet,
      disconnect,
      // error,
      getSigningCosmWasmClientOptions,
      getSigningStargateClientOptions,
      isEmbeddedKeplrMobileWeb,
      // status,
    ]
  );

  return (
    <WalletManagerContext.Provider value={value}>
      {children}
      {state.matches("selecting") && (
        <SelectWalletModal
          classNames={classNames}
          closeIcon={closeIcon}
          isOpen={pickerModalOpen}
          onClose={() => setPickerModalOpen(false)}
          selectWallet={connectToWallet}
          wallets={enabledWallets}
        />
      )}
      {state.matches("connecting") && Boolean(walletConnectUri) && (
        <WalletConnectModal
          classNames={classNames}
          closeIcon={closeIcon}
          isOpen
          onClose={disconnect}
          reset={resetConnection}
          uri={walletConnectUri}
          walletConnectAppDeepLink={state.context.walletConnectAppDeepLink}
          appInstallationLink={state.context.walletConnectInstallationUri}
        />
      )}
      {state.matches("connecting") && walletEnableModalOpen && (
        <EnablingWalletModal
          classNames={classNames}
          closeIcon={closeIcon}
          isOpen
          onClose={() => setWalletEnableModalOpen(false)}
          renderLoader={renderLoader}
          reset={resetConnection}
        />
      )}
      {false && (
        <BaseModal
          classNames={classNames}
          isOpen
          maxWidth="24rem"
          title="Resetting..."
        >
          {renderLoader?.()}
        </BaseModal>
      )}
      {/*{JSON.stringify(state.value)} <br />*/}
      {/*{JSON.stringify({ walletConnectUri })} <br /> <br /> <br /> <br />*/}
      {/*{JSON.stringify(state.context, null, 2)}*/}
    </WalletManagerContext.Provider>
  );
};
