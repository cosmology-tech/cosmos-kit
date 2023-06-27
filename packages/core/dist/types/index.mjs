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
export {
  ModalView,
  State,
  SuggestTokenTypes,
  WalletStatus
};
//# sourceMappingURL=index.mjs.map