// src/chain-wallet.ts
import {
  ChainWalletBase,
  State
} from "@cosmos-kit/core";
var ChainWC = class extends ChainWalletBase {
  constructor(walletInfo, chainInfo, WCClient) {
    super(walletInfo, chainInfo);
    this.clientMutable = { state: State.Init };
    this.WCClient = WCClient;
  }
  setClientNotExist() {
    this.setState(State.Error);
    this.setMessage(this.clientMutable.message);
  }
};
export {
  ChainWC
};
//# sourceMappingURL=chain-wallet.mjs.map