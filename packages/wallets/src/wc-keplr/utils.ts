import { Keplr } from "@keplr-wallet/types";
import WalletConnect from "@walletconnect/client";
// import { KeplrQRCodeModalV1 } from "@keplr-wallet/wc-qrcode-modal";
import { KeplrQRCodeModalV1 } from "./modal";
import { KeplrWalletConnectV1 } from "@keplr-wallet/wc-client";
import { BroadcastMode } from "@cosmjs/launchpad";
import Axios from "axios";
import { chains } from "chain-registry";
import { Buffer } from "buffer/";
import { Dispatch } from "@cosmos-kit/core";

let keplr: Keplr | undefined = undefined;
let promise: Promise<Keplr> | undefined = undefined;

export async function sendTx(
    chainId: string,
    tx: Uint8Array,
    mode: BroadcastMode
): Promise<Uint8Array> {
    const params = {
        tx_bytes: Buffer.from(tx as any).toString("base64"),
        mode: (() => {
            switch (mode) {
                case "async":
                    return "BROADCAST_MODE_ASYNC";
                case "block":
                    return "BROADCAST_MODE_BLOCK";
                case "sync":
                    return "BROADCAST_MODE_SYNC";
                default:
                    return "BROADCAST_MODE_UNSPECIFIED";
            }
        })(),
    };

    const restInstance = Axios.create({
        baseURL: chains.find((chainInfo) => chainInfo.chain_id === chainId)!
            .apis?.rest?.[0].address,
    });

    const result = await restInstance.post("/cosmos/tx/v1beta1/txs", params);

    return Buffer.from(result.data["tx_response"].txhash, "hex");
}

export function getWCKeplr(
    emitQrUri?: Dispatch<string | undefined>,
    emitOpenModal?: Dispatch<boolean>,
): Promise<Keplr> {
    if (keplr) {
        return Promise.resolve(keplr);
    }

    const fn = () => {
        const connector = new WalletConnect({
            bridge: "https://bridge.walletconnect.org", // Required
            qrcodeModal: {
                open: (uri: string, cb: any) => {
                    emitQrUri?.(uri);
                },
                close: () => {
                    emitQrUri?.(undefined);
                }
            }
            // qrcodeModal: new KeplrQRCodeModalV1()
        });

        // Check if connection is already established
        if (!connector.connected) {
            // create new session
            connector.createSession();

            return new Promise<Keplr>((resolve, reject) => {
                connector.on("connect", (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        keplr = new KeplrWalletConnectV1(connector, {
                            sendTx,
                        });
                        resolve(keplr);
                    }
                });
            });
        } else {
            keplr = new KeplrWalletConnectV1(connector, {
                sendTx,
            });
            return Promise.resolve(keplr);
        }
    };

    if (!promise) {
        promise = fn();
    }

    return promise;
}
