import { assign } from "xstate";
import { WalletMachineContextType, WalletMachineEvent } from "./types";

export const cleanUpWalletConnectURI = assign<WalletMachineContextType>({
  walletConnectUri: undefined,
});

export const cleanUpConnectedWalletState = assign<WalletMachineContextType>({
  walletType: undefined,
  connectedWallet: undefined,
  walletConnect: undefined,
  walletConnectUri: undefined,
});

export const assignConnectedWallet = assign<
  WalletMachineContextType,
  WalletMachineEvent
>({
  connectedWallet: (context, event) => {
    return "connectedWallet" in event && event.connectedWallet;
  },
});

export const assignSelectedWallet = assign<
  WalletMachineContextType,
  WalletMachineEvent
>((context: WalletMachineContextType, event) => {
  const walletType = "walletType" in event && event.walletType;

  const wallet = context.enabledWallets.find(
    (walletConfig) => walletConfig.type === walletType
  );

  return {
    walletType,
    wallet,
  };
});

export const assignErrorState = assign({
  error: (_, event: any) => {
    return {
      instance: event.data as Error | undefined,
      message: String(event.data) || "Unknown error",
    };
  },
});

export const assignReceivedWalletConnectURI = assign<
  WalletMachineContextType,
  WalletMachineEvent
>((_, event) => {
  const walletConnectUri =
    "walletConnectUri" in event && event.walletConnectUri;
  const cleanUpWalletConnectCallback =
    "cleanUpWalletConnectCallback" in event &&
    event.cleanUpWalletConnectCallback;
  return {
    walletConnectUri,
    cleanUpWalletConnectCallback,
  };
});

export const assignReceivedWalletConnectInstance = assign<
  WalletMachineContextType,
  WalletMachineEvent
>((_, event) => {
  const walletConnect = "walletConnect" in event && event.walletConnect;
  const instantiateWebsocketConnection =
    "instantiateWebsocketConnection" in event &&
    event.instantiateWebsocketConnection;

  return {
    walletConnect,
    instantiateWebsocketConnection,
  };
});
