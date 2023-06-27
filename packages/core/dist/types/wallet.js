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

// src/types/wallet.ts
var wallet_exports = {};
__export(wallet_exports, {
  SuggestTokenTypes: () => SuggestTokenTypes,
  WalletStatus: () => WalletStatus
});
module.exports = __toCommonJS(wallet_exports);
var WalletStatus = /* @__PURE__ */ ((WalletStatus2) => {
  WalletStatus2["Disconnected"] = "Disconnected";
  WalletStatus2["Connecting"] = "Connecting";
  WalletStatus2["Connected"] = "Connected";
  WalletStatus2["NotExist"] = "NotExist";
  WalletStatus2["Rejected"] = "Rejected";
  WalletStatus2["Error"] = "Error";
  return WalletStatus2;
})(WalletStatus || {});
var SuggestTokenTypes = {
  CW20: "cw20",
  ERC20: "erc20"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SuggestTokenTypes,
  WalletStatus
});
//# sourceMappingURL=wallet.js.map