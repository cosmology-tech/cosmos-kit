import { assign } from "xstate";
import { WalletMachineContextType, WalletMachineEvent } from "./types";
import { KeplrWalletConnectV1 } from "../connectors";
import { isAndroid } from "@walletconnect/browser-utils";
import { getWalletConnectAppLink } from "./util";

export const cleanUpWalletConnectURI = assign<WalletMachineContextType>({
  walletConnectUri: undefined,
  walletConnectAppDeepLink: undefined,
  walletConnectInstallationUri: undefined,
});

export const cleanUpConnectedWalletState = assign<WalletMachineContextType>({
  walletType: undefined,
  connectedWallet: undefined,
  walletConnect: undefined,
  walletConnectUri: undefined,
  walletConnectAppDeepLink: undefined,
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

const IOS_KEPLR_MOBILE_URL = "itms-apps://itunes.apple.com/app/1567851089";
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
    walletConnectAppDeepLink: getWalletConnectAppLink(walletConnectUri),
    walletConnectInstallationUri: isAndroid() ? getWalletConnectAppLink(walletConnectUri) : IOS_KEPLR_MOBILE_URL;
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

export async function killWalletConnectSession(
  context: WalletMachineContextType
) {
  // Disconnect WalletConnect.
  if (context.walletConnect?.connected) {
    await context.walletConnect.killSession();
  }
}

/* todo: figure out a better spot for this */
export function cleanUpWalletConnect({
  walletClient,
  cleanUpWalletConnectCallback,
}: WalletMachineContextType) {
  if (walletClient instanceof KeplrWalletConnectV1) {
    walletClient.dontOpenAppOnEnable = false;
  }
  if (cleanUpWalletConnectCallback) {
    cleanUpWalletConnectCallback();
  }
}

export const updateWalletTypeInStorage = ({
  config,
  walletType,
}: WalletMachineContextType) => {
  if (config.localStorageKey) {
    localStorage.setItem(config.localStorageKey, walletType);
  }
};

export const clearWalletTypeInStorage = (context: WalletMachineContextType) => {
  if (context.config.localStorageKey) {
    localStorage.removeItem(context.config.localStorageKey);
  }
};

export const navigateToWalletConnectApp = ({
  walletConnectUri,
}: WalletMachineContextType) => {
  window.location.assign(getWalletConnectAppLink(walletConnectUri));
};
