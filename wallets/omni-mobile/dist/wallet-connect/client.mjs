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
export {
  OmniClient
};
//# sourceMappingURL=client.mjs.map