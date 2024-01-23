import { Wallet } from "@cosmos-kit/core";
import { MainWalletBase } from "@cosmos-kit/core";

import { ChainCosmosSocial } from "./chain-wallet";
import { CosmosCapsuleClient } from "./client";
import { CapsuleProvider, CapsuleEnvironment } from "@leapwallet/cosmos-social-login-capsule-provider";

export class LeapCapsuleWallet extends MainWalletBase {
  constructor(walletInfo: Wallet) {
    super(walletInfo, ChainCosmosSocial);
  }

  async initClient() {
    this.initingClient();
    try {
      this.initClientDone(new CosmosCapsuleClient({ loginProvider: new CapsuleProvider({ apiKey: process.env.CAPSULE_KEY || process.env.NEXT_PUBLIC_CAPSULE_KEY, env: process.env.CAPSULE_ENV || process.env.NEXT_PUBLIC_CAPSULE_ENV as unknown as CapsuleEnvironment }) }));
    } catch (error) {
      this.initClientError(error as Error);
    }
  }
}
