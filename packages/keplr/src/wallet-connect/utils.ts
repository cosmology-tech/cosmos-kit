import { AppEnv } from '@cosmos-kit/core';
import { saveMobileLinkInfo } from '@walletconnect/browser-utils';

export function getAppUrlFromQrUri(qrUri: string, env?: AppEnv) {
  if (env?.isMobile) {
    if (env?.isAndroid) {
      saveMobileLinkInfo({
        name: 'Keplr',
        href: 'intent://wcV1#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;',
      });
      return `intent://wcV1?${qrUri}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;`;
    } else {
      saveMobileLinkInfo({
        name: 'Keplr',
        href: 'keplrwallet://wcV1',
      });
      return `keplrwallet://wcV1?${qrUri}`;
    }
  } else {
    return void 0;
  }
}
