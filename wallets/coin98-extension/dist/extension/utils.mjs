// src/extension/utils.ts
import { ClientNotExistError } from "@cosmos-kit/core";
var getCoin98FromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const provider = window.coin98?.keplr;
  if (provider) {
    return provider;
  }
  if (document.readyState === "complete") {
    if (provider) {
      return provider;
    } else {
      throw ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (provider) {
          resolve(provider);
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
  getCoin98FromExtension
};
//# sourceMappingURL=utils.mjs.map