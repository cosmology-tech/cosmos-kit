// src/wallet-connect/main-wallet.ts
import { WCWallet } from "@cosmos-kit/walletconnect";

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

// src/wallet-connect/main-wallet.ts
var KeplrMobileWallet = class extends WCWallet {
  constructor(walletInfo, preferredEndpoints) {
    super(walletInfo, ChainKeplrMobile, KeplrClient);
    this.preferredEndpoints = preferredEndpoints;
  }
};
export {
  KeplrMobileWallet
};
//# sourceMappingURL=main-wallet.mjs.map