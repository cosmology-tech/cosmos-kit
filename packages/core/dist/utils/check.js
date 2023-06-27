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

// src/utils/check.ts
var check_exports = {};
__export(check_exports, {
  checkInit: () => checkInit,
  checkKey: () => checkKey
});
module.exports = __toCommonJS(check_exports);
function checkInit(target, targetName, msg) {
  if (target === void 0 || target === null) {
    throw new Error(msg || `${targetName || "Variable"} is not inited!`);
  }
}
function checkKey(target, key, targetName, msg) {
  if (!target.has(key)) {
    throw new Error(msg || `${key} not existed in Map ${targetName}!`);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  checkInit,
  checkKey
});
//# sourceMappingURL=check.js.map