var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension/utils.ts
var utils_exports = {};
__export(utils_exports, {
  getVectisFromExtension: () => getVectisFromExtension
});
module.exports = __toCommonJS(utils_exports);
var import_core = require("@cosmos-kit/core");
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
      throw import_core.ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (vectis) {
          resolve(vectis);
        } else {
          reject(import_core.ClientNotExistError.message);
        }
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };
    document.addEventListener("readystatechange", documentStateChange);
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getVectisFromExtension
});
//# sourceMappingURL=utils.js.map