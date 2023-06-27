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

// src/types/common.ts
var common_exports = {};
__export(common_exports, {
  State: () => State
});
module.exports = __toCommonJS(common_exports);
var State = /* @__PURE__ */ ((State2) => {
  State2["Init"] = "Init";
  State2["Pending"] = "Pending";
  State2["Done"] = "Done";
  State2["Error"] = "Error";
  return State2;
})(State || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  State
});
//# sourceMappingURL=common.js.map