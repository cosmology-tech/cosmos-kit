import type { IWalletConnectOptions } from "@walletconnect/types";

type InstantiateWalletConnectArgs = {
  open: IWalletConnectOptions["qrcodeModal"]["open"];
  close: IWalletConnectOptions["qrcodeModal"]["close"];
  clientMeta: IWalletConnectOptions["clientMeta"];
};

export async function instantiateWalletConnect({
  open,
  close,
  clientMeta,
}: InstantiateWalletConnectArgs) {
  const walletConnect = new (await import("@walletconnect/client")).default({
    bridge: "https://bridge.walletconnect.org",
    signingMethods: [
      "keplr_enable_wallet_connect_v1",
      "keplr_sign_amino_wallet_connect_v1",
    ],
    qrcodeModal: {
      open,
      // Occurs on disconnect, which is handled elsewhere.
      close,
    },
    // clientMeta,
  });
  // clientMeta in constructor is ignored for some reason, so
  // let's set it directly :)))))))))))))
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  walletConnect._clientMeta = clientMeta;
  return walletConnect;
}
