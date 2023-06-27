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

// src/utils/session.ts
var session_exports = {};
__export(session_exports, {
  Session: () => Session
});
module.exports = __toCommonJS(session_exports);
var Session = class {
  constructor(sessionOptions) {
    this.sessionOptions = sessionOptions;
  }
  update() {
    if (typeof this.timeoutId !== "undefined") {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.sessionOptions.callback?.();
    }, this.sessionOptions.duration);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Session
});
//# sourceMappingURL=session.js.map