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
export {
  ChainCosmostationMobile
};
//# sourceMappingURL=chain-wallet.mjs.map