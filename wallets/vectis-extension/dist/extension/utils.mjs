// src/extension/utils.ts
import { ClientNotExistError } from "@cosmos-kit/core";
var getVectisFromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const vectis = window.vectis?.cosmos;
  if (vectis) {
    return vectis;
  }
  if (document.readyState === "complete") {
    if (vectis) {
      return vectis;
    } else {
      throw ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (vectis) {
          resolve(vectis);
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
  getVectisFromExtension
};
//# sourceMappingURL=utils.mjs.map