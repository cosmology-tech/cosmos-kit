// src/extension/utils.ts
import { ClientNotExistError } from "@cosmos-kit/core";
var getFrontierFromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const frontier = window.frontier?.cosmos;
  if (frontier) {
    return frontier;
  }
  if (document.readyState === "complete") {
    if (frontier) {
      return frontier;
    } else {
      throw ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (frontier) {
          resolve(frontier);
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
  getFrontierFromExtension
};
//# sourceMappingURL=utils.mjs.map