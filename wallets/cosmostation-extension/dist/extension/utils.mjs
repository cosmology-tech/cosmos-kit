// src/extension/utils.ts
import { ClientNotExistError } from "@cosmos-kit/core";
var getCosmostationFromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const cosmostation = window.cosmostation;
  if (cosmostation) {
    return cosmostation;
  }
  if (document.readyState === "complete") {
    if (cosmostation) {
      return cosmostation;
    } else {
      throw ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (cosmostation) {
          resolve(cosmostation);
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
  getCosmostationFromExtension
};
//# sourceMappingURL=utils.mjs.map