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

// src/types/index.ts
var types_exports = {};
__export(types_exports, {
  ModalView: () => ModalView,
  State: () => State,
  SuggestTokenTypes: () => SuggestTokenTypes,
  WalletStatus: () => WalletStatus
});
module.exports = __toCommonJS(types_exports);

// src/types/common.ts
var State = /* @__PURE__ */ ((State2) => {
  State2["Init"] = "Init";
  State2["Pending"] = "Pending";
  State2["Done"] = "Done";
  State2["Error"] = "Error";
  return State2;
})(State || {});

// src/types/wallet.ts
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

// src/types/view.ts
var ModalView = /* @__PURE__ */ ((ModalView2) => {
  ModalView2["WalletList"] = "WalletList";
  ModalView2["Connecting"] = "Connecting";
  ModalView2["Connected"] = "Connected";
  ModalView2["Error"] = "Error";
  ModalView2["NotExist"] = "NotExist";
  ModalView2["Rejected"] = "Rejected";
  ModalView2["QRCode"] = "QRCode";
  return ModalView2;
})(ModalView || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ModalView,
  State,
  SuggestTokenTypes,
  WalletStatus
});
//# sourceMappingURL=index.js.map