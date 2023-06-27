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

// src/extension/extension.ts
var extension_exports = {};
__export(extension_exports, {
  StationExtension: () => StationExtension
});
module.exports = __toCommonJS(extension_exports);
var import_feather = require("@terra-money/feather.js");
function isValidResult({ error, ...payload }) {
  if (typeof payload.success !== "boolean") {
    return false;
  } else if (typeof payload.result === "undefined" && typeof error === "undefined") {
    return false;
  }
  return true;
}
var StationExtension = class {
  constructor() {
    this.identifier = "station";
    this._inTransactionProgress = false;
    // resolvers
    this.connectResolvers = /* @__PURE__ */ new Set();
    this.infoResolvers = /* @__PURE__ */ new Set();
    this.pubkeyResolvers = /* @__PURE__ */ new Set();
    this.signResolvers = /* @__PURE__ */ new Map();
  }
  get isAvailable() {
    return this.extension.isAvailable;
  }
  async init() {
    this.extension = new import_feather.Extension();
    this.onResponse();
  }
  async connect() {
    return new Promise((...resolver) => {
      this.connectResolvers.add(resolver);
      this.extension.connect();
    });
  }
  async info() {
    return new Promise((...resolver) => {
      this.infoResolvers.add(resolver);
      this.extension.info();
    });
  }
  async getPubKey() {
    return new Promise((...resolver) => {
      this.pubkeyResolvers.add(resolver);
      this.extension.pubkey();
    });
  }
  disconnect() {
    this.connectResolvers.clear();
    this.infoResolvers.clear();
    this.signResolvers.clear();
  }
  async sign({ purgeQueue = true, ...data }) {
    return new Promise((...resolver) => {
      this._inTransactionProgress = true;
      const id = this.extension.sign({
        ...data,
        purgeQueue
      });
      this.signResolvers.set(id, resolver);
      setTimeout(() => {
        if (this.signResolvers.has(id)) {
          this.signResolvers.delete(id);
          if (this.signResolvers.size === 0) {
            this._inTransactionProgress = false;
          }
        }
      }, 1e3 * 120);
    });
  }
  onResponse() {
    this.extension.on("onConnect", (result) => {
      if (!result)
        return;
      const { error, ...payload } = result;
      for (const [resolve, reject] of this.connectResolvers) {
        if (error) {
          reject(error);
        } else {
          resolve(payload);
        }
      }
      this.connectResolvers.clear();
    });
    this.extension.on("onGetPubkey", (result) => {
      if (!result)
        return;
      const { error, ...payload } = result;
      for (const [resolve, reject] of this.pubkeyResolvers) {
        if (error) {
          reject(error);
        } else {
          resolve(payload);
        }
      }
      this.pubkeyResolvers.clear();
    });
    this.extension.on("onInterchainInfo", (result) => {
      if (!result)
        return;
      const { error, ...payload } = result;
      for (const [resolve, reject] of this.infoResolvers) {
        if (error) {
          reject(error);
        } else {
          resolve(payload);
        }
      }
      this.infoResolvers.clear();
    });
    this.extension.on("onSign", (result) => {
      if (!result || !isValidResult(result)) {
        return;
      }
      const { error, ...payload } = result;
      if (this.signResolvers.has(payload.id)) {
        const [resolve, reject] = this.signResolvers.get(payload.id);
        if (!payload.success) {
          reject(error);
        } else if (resolve) {
          resolve({ name: "onSign", payload });
        }
        this.signResolvers.delete(payload.id);
        if (this.signResolvers.size === 0) {
          this._inTransactionProgress = false;
        }
      }
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StationExtension
});
//# sourceMappingURL=extension.js.map