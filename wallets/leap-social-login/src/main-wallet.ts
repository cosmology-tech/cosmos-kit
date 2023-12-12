import { Wallet } from "@cosmos-kit/core";
import { MainWalletBase } from "@cosmos-kit/core";

import { ChainCosmosSocial } from "./chain-wallet";
import { CosmosCapsuleClient } from "./client";
import { CapsuleProvider, Environment } from "@leapwallet/cosmos-social-login-capsule-provider";
import { capsuleOptions } from "./types";

export class LeapCapsuleWallet extends MainWalletBase {
  options: capsuleOptions;
  constructor({ walletInfo, options }: { walletInfo: Wallet, options: capsuleOptions }) {
    super(walletInfo, ChainCosmosSocial);
    this.options = options;
  }

  async initClient() {
    this.initingClient();
    try {
      this.initClientDone(new CosmosCapsuleClient({ loginProvider: new CapsuleProvider({ apiKey: process.env.CAPSULE_KEY, env: process.env.CAPSULE_ENV as unknown as Environment }) }));
    } catch (error) {
      this.initClientError(error as Error);
    }
  }
}
