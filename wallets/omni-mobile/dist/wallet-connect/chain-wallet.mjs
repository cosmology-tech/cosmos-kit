// src/wallet-connect/chain-wallet.ts
import { ChainWC } from "@cosmos-kit/walletconnect";

// src/wallet-connect/client.ts
import { WCClient } from "@cosmos-kit/walletconnect";
var OmniClient = class extends WCClient {
  constructor(walletInfo) {
    super(walletInfo);
  }
  async signAmino(chainId, signer, signDoc, signOptions) {
    const { signDoc: signed, signature } = await this._signAmino(
      chainId,
      signer,
      signDoc,
      signOptions
    );
    return {
      signed,
      signature
    };
  }
  async signDirect(chainId, signer, signDoc, signOptions) {
    const { signDoc: signed, signature } = await this._signDirect(
      chainId,
      signer,
      signDoc,
      signOptions
    );
    return {
      signed,
      signature
    };
  }
};

// src/wallet-connect/chain-wallet.ts
var ChainOmniMobile = class extends ChainWC {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo, OmniClient);
  }
};
export {
  ChainOmniMobile
};
//# sourceMappingURL=chain-wallet.mjs.map