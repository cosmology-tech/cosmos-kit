// src/wallet-connect/main-wallet.ts
import { WCWallet } from "@cosmos-kit/walletconnect";

// src/wallet-connect/chain-wallet.ts
import { ChainWC } from "@cosmos-kit/walletconnect";

// src/wallet-connect/client.ts
import { WCClient } from "@cosmos-kit/walletconnect";
var TrustClient = class extends WCClient {
  constructor(walletInfo) {
    super(walletInfo);
    this.getOfflineSignerAmino = void 0;
  }
  async signAmino(chainId, signer, signDoc, signOptions) {
    throw new Error("Trust doesn't support `signAmino` method.");
  }
  async signDirect(chainId, signer, signDoc, signOptions) {
    const result = await this._signDirect(
      chainId,
      signer,
      signDoc,
      signOptions
    );
    return {
      signed: signDoc,
      signature: result
    };
  }
};

// src/wallet-connect/chain-wallet.ts
var ChainTrustMobile = class extends ChainWC {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo, TrustClient);
  }
};

// src/wallet-connect/main-wallet.ts
var TrustMobileWallet = class extends WCWallet {
  constructor(walletInfo, preferredEndpoints) {
    super(walletInfo, ChainTrustMobile, TrustClient);
    this.preferredEndpoints = preferredEndpoints;
  }
};
export {
  TrustMobileWallet
};
//# sourceMappingURL=main-wallet.mjs.map