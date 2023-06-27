// src/extension/main-wallet.ts
import { MainWalletBase } from "@cosmos-kit/core";

// src/extension/chain-wallet.ts
import { ChainWalletBase } from "@cosmos-kit/core";
var ChainExodusExtension = class extends ChainWalletBase {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo);
  }
};

// src/extension/client.ts
var ExodusClient = class {
  constructor(client) {
    this.client = client;
  }
  async connect(chainId) {
    await this.client.connect({
      chainId: Array.isArray(chainId) ? chainId[0] : chainId
    });
  }
  async getSimpleAccount(chainId) {
    const { address } = await this.getAccount(chainId);
    return {
      namespace: "cosmos",
      chainId,
      address
    };
  }
  async getAccount(chainId) {
    const response = await this.client.connect({ chainId });
    return {
      ...response,
      pubkey: response.publicKey
    };
  }
  async getOfflineSigner(chainId) {
    return {
      getAccounts: async () => [
        await this.getAccount(chainId)
      ],
      signDirect: async (signer, signDoc) => {
        return this.client.signTransaction(signDoc);
      }
    };
  }
  async signAmino(chainId, signer, signDoc) {
    return this.client.signAminoTransaction(signDoc);
  }
  async sendTx(chainId, transaction, mode) {
    return this.client.sendTx(chainId, transaction, mode);
  }
};

// src/extension/utils.ts
import { ClientNotExistError } from "@cosmos-kit/core";
var getExodusFromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const exodus = window.exodus;
  if (exodus) {
    return exodus;
  }
  if (document.readyState === "complete") {
    if (exodus) {
      return exodus;
    } else {
      throw ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (exodus) {
          resolve(exodus);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };
    document.addEventListener("readystatechange", documentStateChange);
  });
};

// src/extension/main-wallet.ts
var ExodusExtensionWallet = class extends MainWalletBase {
  constructor(walletInfo, preferredEndpoints) {
    super(walletInfo, ChainExodusExtension);
    this.preferredEndpoints = preferredEndpoints;
  }
  async initClient() {
    this.initingClient();
    try {
      const exodus = await getExodusFromExtension();
      if (!exodus?.cosmos) {
        throw new Error("Exodus client does not support Cosmos provider");
      }
      this.initClientDone(exodus ? new ExodusClient(exodus.cosmos) : void 0);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
};
export {
  ExodusExtensionWallet
};
//# sourceMappingURL=main-wallet.mjs.map