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
export {
  TrustClient
};
//# sourceMappingURL=client.mjs.map