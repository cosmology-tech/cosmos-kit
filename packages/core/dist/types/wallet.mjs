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
export {
  SuggestTokenTypes,
  WalletStatus
};
//# sourceMappingURL=wallet.mjs.map