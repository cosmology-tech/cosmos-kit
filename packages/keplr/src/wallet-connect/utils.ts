import { AppEnv } from '@cosmos-kit/core';
import { saveMobileLinkInfo } from '@walletconnect/browser-utils';

export function getAppUrl(qrUri?: string, env?: AppEnv) {
  if (env?.isMobile) {
    if (env?.isAndroid) {
      saveMobileLinkInfo({
        name: 'Keplr',
        href: 'intent://wcV1#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;',
      });
      return qrUri
        ? `intent://wcV1?${qrUri}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;`
        : 'intent://wcV1#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;';
    } else {
      saveMobileLinkInfo({
        name: 'Keplr',
        href: 'keplrwallet://wcV1',
      });
      return qrUri ? `keplrwallet://wcV1?${qrUri}` : 'keplrwallet://wcV1';
    }
  } else {
    return void 0;
  }
}
