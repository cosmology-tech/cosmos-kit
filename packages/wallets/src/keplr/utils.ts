import { Window as KeplrWindow, Keplr } from "@keplr-wallet/types";

declare global {
    interface Window extends KeplrWindow { }
}

const error = new Error('No keplr extension installed!');

export const getKeplrFromExtension: () => Promise<Keplr>
    = async () => {
        if (typeof window === "undefined") {
            throw error;
        }

        if (window.keplr) {
            return window.keplr;
        }

        if (document.readyState === "complete") {
            if (!window.keplr) {
                throw error;
            } else {
                return window.keplr;
            }
        }

        return new Promise((resolve, reject) => {
            const documentStateChange = (event: Event) => {
                if (
                    event.target &&
                    (event.target as Document).readyState === "complete"
                ) {
                    if (!window.keplr) {
                        reject(error.message)
                    } else {
                        resolve(window.keplr);
                    }
                    document.removeEventListener("readystatechange", documentStateChange);
                }
            };

            document.addEventListener("readystatechange", documentStateChange);
        });
    };