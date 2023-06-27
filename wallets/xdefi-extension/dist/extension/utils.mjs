// src/extension/utils.ts
import { ClientNotExistError } from "@cosmos-kit/core";
var getXDEFIFromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const xdefi = window?.xfi?.keplr;
  if (xdefi && !xdefi.isXDEFI) {
    throw ClientNotExistError;
  }
  if (xdefi) {
    return xdefi;
  }
  if (document.readyState === "complete") {
    if (xdefi) {
      return xdefi;
    } else {
      throw ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (xdefi) {
          resolve(xdefi);
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
  getXDEFIFromExtension
};
//# sourceMappingURL=utils.mjs.map