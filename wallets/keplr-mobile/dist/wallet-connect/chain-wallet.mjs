// src/wallet-connect/chain-wallet.ts
import { ChainWC } from "@cosmos-kit/walletconnect";

// src/wallet-connect/client.ts
import { WCClient } from "@cosmos-kit/walletconnect";
var KeplrClient = class extends WCClient {
  constructor(walletInfo) {
    super(walletInfo);
  }
};

// src/wallet-connect/chain-wallet.ts
var ChainKeplrMobile = class extends ChainWC {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo, KeplrClient);
  }
};
export {
  ChainKeplrMobile
};
//# sourceMappingURL=chain-wallet.mjs.map