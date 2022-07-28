import { instantiateWalletConnect } from "../utils/instantiateWalletConnect";
import { getChainInfo, getConnectedWalletInfo } from "../utils";
import { KeplrWalletConnectV1 } from "../connectors";
import { WalletMachineContextType, WalletMachineEvent } from "./types";
import { WalletType } from "../types";
import { fetchKeplrInstance } from "../utils/fetchKeplrInstance";

export function requestWalletConnect({
  config: { walletConnectClientMeta },
  walletConnect: walletConnectInContext,
}: WalletMachineContextType) {
  /*
   * todo: when disconnected, do you want to connect to another wallet instead or keep the same keplr session?
   *       or you want the list of previously connected wallets?
   * */
  return async function establishWalletConnection(send) {
    let walletConnect = walletConnectInContext;

    const shouldInstantiateWalletConnect = !walletConnect;

    if (shouldInstantiateWalletConnect) {
      walletConnect = await instantiateWalletConnect({
        open: (
          walletConnectUri: string,
          cleanUpWalletConnectCallback: () => void
        ) => {
          // Open QR modal by setting URI.
          send({
            type: "RECEIVE_WALLET_CONNECT_URI",
            cleanUpWalletConnectCallback,
            walletConnectUri,
          });
        },
        // Occurs on disconnect, which is handled elsewhere.
        close: () => console.log("qrcodeModal.close"),
        clientMeta: walletConnectClientMeta,
      });
    }

    // todo: remove the debugging
    // @ts-ignore
    window.walletConnect = walletConnect;

    if (walletConnect.connected) {
      // WalletConnect already connected, nothing to do.
      send({
        type: "REQUEST_WALLET_CONNECT_FULFILLED",
        walletConnect,
      });
    } else {
      walletConnect.on("connect", function connect() {
        send({
          type: "REQUEST_WALLET_CONNECT_FULFILLED",
          walletConnect,
          instantiateWebsocketConnection: true,
        });

        walletConnect.on("disconnect", () => {
          send("DISCONNECT");
        });
      });

      walletConnect.connect();
    }
  };
}

export function enableWallet(
  {
    walletType,
    wallet,
    utils,
    config,
    walletConnect,
  }: WalletMachineContextType,
  data: WalletMachineEvent
) {
  return async (send) => {
    const chainInfo = await getChainInfo(
      config.defaultChainId,
      config.chainInfoOverrides
    );

    const walletClient = await wallet.getClient(chainInfo, walletConnect);
    if (!walletClient) {
      throw new Error("Failed to retrieve wallet client.");
    }

    // Prevent double app open request.
    if (walletClient instanceof KeplrWalletConnectV1) {
      walletClient.dontOpenAppOnEnable = Boolean(
        "instantiateWebsocketConnection" in data
          ? data.instantiateWebsocketConnection
          : false
      );
    }

    const signerOptions = await Promise.all([
      utils.getSigningCosmWasmClientOptions?.(chainInfo),
      utils.getSigningStargateClientOptions?.(chainInfo),
    ]);

    // Save connected wallet data.
    const connectedWallet = await getConnectedWalletInfo(
      wallet,
      walletClient,
      chainInfo,
      ...signerOptions
    );

    /* todo: move side effects out of the action */
    // Save localStorage value.
    if (config.localStorageKey) {
      localStorage.setItem(config.localStorageKey, wallet.type);
    }

    send({
      type: "WALLET_ENABLE",
      connectedWallet,
    });
  };
}

export function subscribeToKeplrWalletChange() {
  return (send) => {
    if (typeof window !== "undefined") {
      const listener = () => send("RECONNECT");

      // Add event listener.
      window.addEventListener("keplr_keystorechange", listener);

      // Remove event listener on clean up.
      return () => {
        window.removeEventListener("keplr_keystorechange", listener);
      };
    }
  };
}

export function prepareInitialState({
  config: { localStorageKey },
}: WalletMachineContextType) {
  return async (send) => {
    // Try to fetch value from localStorage.
    const cachedWalletType = localStorageKey
      ? (localStorage.getItem(localStorageKey) as WalletType | undefined)
      : undefined;

    /* todo: move preselection outside */
    // serialize preselected wallet type
    const automaticWalletType = cachedWalletType || undefined;

    const keplr = await fetchKeplrInstance();

    send({
      type: "RECEIVED_INITIAL_STATE",
      walletType: automaticWalletType,
      isEmbeddedKeplrMobileWeb: keplr && keplr.mode === "mobile-web",
    });
  };
}
