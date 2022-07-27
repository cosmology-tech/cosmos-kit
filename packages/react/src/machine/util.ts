import { isAndroid, isMobile } from "@walletconnect/browser-utils";

export const getWalletConnectAppLink = (walletConnectUri: string) => {
  // Not on mobile, bail out early.
  if (!isMobile()) return;

  return isAndroid()
    ? `intent://wcV1?${walletConnectUri}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;`
    : `keplrwallet://wcV1?${walletConnectUri}`;
};
