// src/extension/utils.ts
import { ClientNotExistError } from "@cosmos-kit/core";
var getCompassFromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const compass = window.compass;
  if (compass) {
    return compass;
  }
  if (document.readyState === "complete") {
    if (compass) {
      return compass;
    } else {
      throw ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (compass) {
          resolve(compass);
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
  getCompassFromExtension
};
//# sourceMappingURL=utils.mjs.map