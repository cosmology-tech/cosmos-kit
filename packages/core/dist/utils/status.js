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

// src/utils/status.ts
var status_exports = {};
__export(status_exports, {
  getWalletStatusFromState: () => getWalletStatusFromState
});
module.exports = __toCommonJS(status_exports);

// src/utils/error.ts
var ClientNotExistError = new Error("Client Not Exist!");
var RejectedError = new Error("Request Rejected!");
var ExpiredError = new Error("Expired!");

// src/utils/status.ts
var getWalletStatusFromState = (state, message) => {
  switch (state) {
    case "Pending":
      return "Connecting" /* Connecting */;
    case "Done":
      return "Connected" /* Connected */;
    case "Error":
      switch (message) {
        case ClientNotExistError.message:
          return "NotExist" /* NotExist */;
        case RejectedError.message:
          return "Rejected" /* Rejected */;
        default:
          return "Error" /* Error */;
      }
    case "Init":
      return "Disconnected" /* Disconnected */;
    default:
      return "Disconnected" /* Disconnected */;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getWalletStatusFromState
});
//# sourceMappingURL=status.js.map