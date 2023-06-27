// src/main-wallet.ts
import { State } from "@cosmos-kit/core";
import { MainWalletBase } from "@cosmos-kit/core";
var WCWallet = class extends MainWalletBase {
  constructor(walletInfo, ChainWC, WCClient) {
    if (!walletInfo.walletconnect) {
      throw new Error(
        `'walletconnect' info for wallet ${walletInfo.prettyName} is not provided in wallet registry.`
      );
    }
    super(walletInfo, ChainWC);
    this.clientMutable = { state: State.Init };
    this.WCClient = WCClient;
  }
  async initClient(options) {
    if (!options) {
      this.initClientError(
        new Error("`walletconnectOptions` is not provided.")
      );
      return;
    }
    if (!options.signClient.projectId) {
      this.initClientError(
        new Error("`projectId` is not provided in `walletconnectOptions`.")
      );
      return;
    }
    this.initingClient();
    try {
      const client = new this.WCClient(this.walletInfo);
      client.logger = this.logger;
      client.emitter = this.emitter;
      client.env = this.env;
      client.options = options;
      await client.init();
      this.initClientDone(client);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
};
export {
  WCWallet
};
//# sourceMappingURL=main-wallet.mjs.map