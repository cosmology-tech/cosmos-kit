import { ChainWalletBase } from "../../../src/bases";
import { ChainRecord, Wallet } from "../../../src/types";

export class ChainMockExtension extends ChainWalletBase {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo, chainInfo);
  }
}
