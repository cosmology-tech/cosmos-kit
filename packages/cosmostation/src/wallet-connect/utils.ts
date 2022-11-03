import { AppEnv } from '@cosmos-kit/core';
import { saveMobileLinkInfo } from '@walletconnect/browser-utils';

export function getAppUrlFromQrUri(qrUri: string, env?: AppEnv) {
  if (env?.isMobile) {
    if (env?.isAndroid) {
      saveMobileLinkInfo({
        name: 'Cosmostation',
        href: '',
      });
      return void 0;
    } else {
      saveMobileLinkInfo({
        name: 'Cosmostation',
        href: '',
      });
      return void 0;
    }
  } else {
    return void 0;
  }
}
