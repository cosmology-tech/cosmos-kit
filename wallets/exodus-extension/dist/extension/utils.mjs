// src/extension/utils.ts
import { ClientNotExistError } from "@cosmos-kit/core";
var getExodusFromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const exodus = window.exodus;
  if (exodus) {
    return exodus;
  }
  if (document.readyState === "complete") {
    if (exodus) {
      return exodus;
    } else {
      throw ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (exodus) {
          resolve(exodus);
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
  getExodusFromExtension
};
//# sourceMappingURL=utils.mjs.map