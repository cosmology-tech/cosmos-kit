// src/wallet-connect/main-wallet.ts
import { WCWallet } from "@cosmos-kit/walletconnect";

// src/wallet-connect/chain-wallet.ts
import { ChainWC } from "@cosmos-kit/walletconnect";

// src/wallet-connect/client.ts
import { WCClient } from "@cosmos-kit/walletconnect";
var LeapClient = class extends WCClient {
  constructor(walletInfo) {
    super(walletInfo);
  }
};

// src/wallet-connect/chain-wallet.ts
var ChainLeapMobile = class extends ChainWC {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo, LeapClient);
  }
};

// src/wallet-connect/main-wallet.ts
var LeapMobileWallet = class extends WCWallet {
  constructor(walletInfo, preferredEndpoints) {
    super(walletInfo, ChainLeapMobile, LeapClient);
    this.preferredEndpoints = preferredEndpoints;
  }
};
export {
  LeapMobileWallet
};
//# sourceMappingURL=main-wallet.mjs.map