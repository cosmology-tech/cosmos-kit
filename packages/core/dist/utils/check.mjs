// src/utils/check.ts
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
export {
  checkInit,
  checkKey
};
//# sourceMappingURL=check.mjs.map