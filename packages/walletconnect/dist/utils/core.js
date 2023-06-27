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

// src/utils/core.ts
var core_exports = {};
__export(core_exports, {
  CoreUtil: () => CoreUtil
});
module.exports = __toCommonJS(core_exports);
var WALLETCONNECT_DEEPLINK_CHOICE = "WALLETCONNECT_DEEPLINK_CHOICE";
var CoreUtil = {
  isHttpUrl(url) {
    return url.startsWith("http://") || url.startsWith("https://");
  },
  formatNativeUrl(appUrl, wcUri, os, name) {
    if (CoreUtil.isHttpUrl(appUrl)) {
      return this.formatUniversalUrl(appUrl, wcUri, name);
    }
    const plainAppUrl = appUrl.replaceAll("/", "").replaceAll(":", "");
    CoreUtil.setWalletConnectDeepLink(plainAppUrl, name);
    const encodedWcUrl = encodeURIComponent(wcUri);
    return `${plainAppUrl}://wc?uri=${encodedWcUrl}`;
  },
  formatUniversalUrl(appUrl, wcUri, name) {
    if (!CoreUtil.isHttpUrl(appUrl)) {
      return this.formatNativeUrl(appUrl, wcUri, name);
    }
    let plainAppUrl = appUrl;
    if (appUrl.endsWith("/")) {
      plainAppUrl = appUrl.slice(0, -1);
    }
    CoreUtil.setWalletConnectDeepLink(plainAppUrl, name);
    const encodedWcUrl = encodeURIComponent(wcUri);
    return `${plainAppUrl}/wc?uri=${encodedWcUrl}`;
  },
  async wait(miliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, miliseconds);
    });
  },
  openHref(href, target = "_self") {
    window.open(href, target, "noreferrer noopener");
  },
  setWalletConnectDeepLink(href, name) {
    localStorage.setItem(
      WALLETCONNECT_DEEPLINK_CHOICE,
      JSON.stringify({ href, name })
    );
  },
  removeWalletConnectDeepLink() {
    localStorage.removeItem(WALLETCONNECT_DEEPLINK_CHOICE);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CoreUtil
});
//# sourceMappingURL=core.js.map