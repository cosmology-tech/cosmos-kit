// src/utils/core.ts
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
export {
  CoreUtil
};
//# sourceMappingURL=index.mjs.map