// src/utils/map.ts
function valuesApply(target, callbackfn) {
  return new Map(
    Array.from(target).map(([key, value]) => [key, callbackfn(value)])
  );
}
export {
  valuesApply
};
//# sourceMappingURL=map.mjs.map