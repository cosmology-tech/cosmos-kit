import { AppEnv } from '@cosmos-kit/core';
import { saveMobileLinkInfo } from '@walletconnect/browser-utils';

export function getAppUrl(qrUri?: string, env?: AppEnv) {
  if (env?.isMobile) {
    if (env?.isAndroid) {
      saveMobileLinkInfo({
        name: 'Cosmostation',
        href: 'intent://wc#Intent;package=wannabit.io.cosmostaion;scheme=cosmostation;end;',
      });
      return qrUri
        ? `intent://wc?${qrUri}#Intent;package=wannabit.io.cosmostaion;scheme=cosmostation;end;`
        : 'intent://wc#Intent;package=wannabit.io.cosmostaion;scheme=cosmostation;end;';
    } else {
      saveMobileLinkInfo({
        name: 'Cosmostation',
        href: 'cosmostation://wc',
      });
      return qrUri ? `cosmostation://wc?${qrUri}` : 'cosmostation://wc';
    }
  } else {
    return void 0;
  }
}
