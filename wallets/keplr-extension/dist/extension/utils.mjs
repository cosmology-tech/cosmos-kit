// src/extension/utils.ts
import { ClientNotExistError } from "@cosmos-kit/core";
var getKeplrFromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const keplr = window.keplr;
  if (keplr) {
    return keplr;
  }
  if (document.readyState === "complete") {
    if (keplr) {
      return keplr;
    } else {
      throw ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (keplr) {
          resolve(keplr);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };
    document.addEventListener("readystatechange", documentStateChange);
  });
};
export {
  getKeplrFromExtension
};
//# sourceMappingURL=utils.mjs.map