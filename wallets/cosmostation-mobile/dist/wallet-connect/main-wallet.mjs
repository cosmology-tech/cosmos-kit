// src/wallet-connect/main-wallet.ts
import { WCWallet } from "@cosmos-kit/walletconnect";

// src/wallet-connect/chain-wallet.ts
import { ChainWC } from "@cosmos-kit/walletconnect";

// src/wallet-connect/client.ts
import { WCClient } from "@cosmos-kit/walletconnect";
var CosmostationClient = class extends WCClient {
  constructor(walletInfo) {
    super(walletInfo);
  }
};

// src/wallet-connect/chain-wallet.ts
var ChainCosmostationMobile = class extends ChainWC {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo, CosmostationClient);
  }
};

// src/wallet-connect/main-wallet.ts
var CosmostationMobileWallet = class extends WCWallet {
  constructor(walletInfo, preferredEndpoints) {
    super(walletInfo, ChainCosmostationMobile, CosmostationClient);
    this.preferredEndpoints = preferredEndpoints;
  }
};
export {
  CosmostationMobileWallet
};
//# sourceMappingURL=main-wallet.mjs.map