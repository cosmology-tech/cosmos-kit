// src/extension/chain-wallet.ts
import { ChainWalletBase } from "@cosmos-kit/core";
var ChainLeapExtension = class extends ChainWalletBase {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo);
  }
};

// src/extension/main-wallet.ts
import { MainWalletBase } from "@cosmos-kit/core";

// src/extension/client.ts
import { chainRegistryChainToKeplr } from "@chain-registry/keplr";
var LeapClient = class {
  constructor(client) {
    this.client = client;
  }
  async enable(chainIds) {
    await this.client.enable(chainIds);
  }
  async suggestToken({ chainId, tokens, type }) {
    if (type === "cw20") {
      for (const { contractAddress } of tokens) {
        await this.client.suggestToken(chainId, contractAddress);
      }
    }
  }
  async addChain(chainInfo) {
    const suggestChain = chainRegistryChainToKeplr(
      chainInfo.chain,
      chainInfo.assetList ? [chainInfo.assetList] : []
    );
    if (chainInfo.preferredEndpoints?.rest?.[0]) {
      suggestChain.rest = chainInfo.preferredEndpoints?.rest?.[0];
    }
    if (chainInfo.preferredEndpoints?.rpc?.[0]) {
      suggestChain.rpc = chainInfo.preferredEndpoints?.rpc?.[0];
    }
    await this.client.experimentalSuggestChain(suggestChain);
  }
  async disconnect() {
    await this.client.disconnect();
  }
  async getSimpleAccount(chainId) {
    const { address, username } = await this.getAccount(chainId);
    return {
      namespace: "cosmos",
      chainId,
      address,
      username
    };
  }
  async getAccount(chainId) {
    const key = await this.client.getKey(chainId);
    return {
      username: key.name,
      address: key.bech32Address,
      algo: key.algo,
      pubkey: key.pubKey
    };
  }
  getOfflineSigner(chainId, preferredSignType) {
    switch (preferredSignType) {
      case "amino":
        return this.getOfflineSignerAmino(chainId);
      case "direct":
        return this.getOfflineSignerDirect(chainId);
      default:
        return this.getOfflineSignerAmino(chainId);
    }
  }
  getOfflineSignerAmino(chainId) {
    return this.client.getOfflineSignerOnlyAmino(chainId);
  }
  getOfflineSignerDirect(chainId) {
    return this.client.getOfflineSigner(chainId);
  }
  async signAmino(chainId, signer, signDoc, signOptions) {
    return await this.client.signAmino(chainId, signer, signDoc, signOptions);
  }
  async signArbitrary(chainId, signer, data) {
    return await this.client.signArbitrary(chainId, signer, data);
  }
  async signDirect(chainId, signer, signDoc, signOptions) {
    return await this.client.signDirect(chainId, signer, signDoc, signOptions);
  }
  async sendTx(chainId, tx, mode) {
    return await this.client.sendTx(chainId, tx, mode);
  }
};

// src/extension/utils.ts
import { ClientNotExistError } from "@cosmos-kit/core";
var getLeapFromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const leap = window.leap;
  if (leap) {
    return leap;
  }
  if (document.readyState === "complete") {
    if (leap) {
      return leap;
    } else {
      throw ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (leap) {
          resolve(leap);
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
var LeapExtensionWallet = class extends MainWalletBase {
  constructor(walletInfo) {
    super(walletInfo, ChainLeapExtension);
  }
  async initClient() {
    this.initingClient();
    try {
      const leap = await getLeapFromExtension();
      this.initClientDone(leap ? new LeapClient(leap) : void 0);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
};

// src/constant.ts
var ICON = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODA1IiBoZWlnaHQ9IjgwNSIgdmlld0JveD0iMCAwIDgwNSA4MDUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF8yMzY0XzMzNzU1KSI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMV8yMzY0XzMzNzU1KSI+CjxwYXRoIGQ9Ik03MTIuMzEgMzczLjU3NUM3MTIuMzEgNDg3LjAzOSA1NzcuMzU1IDUzMy4xNDcgNDA5Ljc5MSA1MzMuMTQ3QzI0Mi4yMjYgNTMzLjE0NyAxMDUuMzA3IDQ4Ny4wMzkgMTA1LjMwNyAzNzMuNTc1QzEwNS4zMDcgMjYwLjExMSAyNDEuMjQ0IDE2OC4yOTcgNDA4LjgwOCAxNjguMjk3QzU3Ni4zNzMgMTY4LjI5NyA3MTIuMzEgMjYwLjMxMSA3MTIuMzEgMzczLjU3NVoiIGZpbGw9IiM0QkFGNzQiLz4KPHBhdGggZD0iTTY4MS41MTMgMTI2LjU0NEM2ODEuNTEzIDY2LjgwNDkgNjMzLjk3NSAxOC4yOTE5IDU3NS40MzUgMTguMjkxOUM1NDIuNDMzIDE4LjI5MTkgNTEyLjk2NyAzMy43Mjc5IDQ5My41MTkgNTcuNzgzOUM0NjcgNTEuNzY5OSA0MzguNzEyIDQ4LjM2MTkgNDA5LjQ0MiA0OC4zNjE5QzM4MC4xNzMgNDguMzYxOSAzNTEuODg1IDUxLjU2OTQgMzI1LjM2NSA1Ny43ODM5QzMwNS43MjEgMzMuNzI3OSAyNzYuMjU1IDE4LjI5MTkgMjQzLjQ0OSAxOC4yOTE5QzE4NC45MSAxOC4yOTE5IDEzNy4zNzEgNjYuODA0OSAxMzcuMzcxIDEyNi41NDRDMTM3LjM3MSAxNDYuMTkgMTQyLjQ3OSAxNjQuNDMyIDE1MS4zMTggMTgwLjI2OUMxNDIuODcxIDE5OC43MTIgMTM4LjM1MyAyMTguMzU4IDEzOC4zNTMgMjM4LjgwNUMxMzguMzUzIDM0NC4wNTEgMjU5Ljc1NCA0MjkuMjQ5IDQwOS40NDIgNDI5LjI0OUM1NTkuMTMxIDQyOS4yNDkgNjgwLjUzMSAzNDQuMDUxIDY4MC41MzEgMjM4LjgwNUM2ODAuNTMxIDIxOC4zNTggNjc2LjAxMyAxOTguNzEyIDY2Ny41NjYgMTgwLjI2OUM2NzYuNDA2IDE2NC40MzIgNjgxLjUxMyAxNDYuMTkgNjgxLjUxMyAxMjYuNTQ0WiIgZmlsbD0iIzMyREE2RCIvPgo8cGF0aCBkPSJNMjM0LjkgMTg2Ljc2NkMyNzAuNzAyIDE4Ni43NjYgMjk5LjcyNSAxNTcuMTQ4IDI5OS43MjUgMTIwLjYxMkMyOTkuNzI1IDg0LjA3NjMgMjcwLjcwMiA1NC40NTgxIDIzNC45IDU0LjQ1ODFDMTk5LjA5OCA1NC40NTgxIDE3MC4wNzQgODQuMDc2MyAxNzAuMDc0IDEyMC42MTJDMTcwLjA3NCAxNTcuMTQ4IDE5OS4wOTggMTg2Ljc2NiAyMzQuOSAxODYuNzY2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTU4MC43OTggMTg2Ljc2NkM2MTYuNiAxODYuNzY2IDY0NS42MjQgMTU3LjE0OCA2NDUuNjI0IDEyMC42MTJDNjQ1LjYyNCA4NC4wNzYzIDYxNi42IDU0LjQ1ODEgNTgwLjc5OCA1NC40NTgxQzU0NC45OTYgNTQuNDU4MSA1MTUuOTczIDg0LjA3NjMgNTE1Ljk3MyAxMjAuNjEyQzUxNS45NzMgMTU3LjE0OCA1NDQuOTk2IDE4Ni43NjYgNTgwLjc5OCAxODYuNzY2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTIwMC4yODggNTI1LjM1MUMyMTQuMjM1IDUyNS4zNTEgMjI1LjIzNiA1MTIuOTIyIDIyMy42NjQgNDk4Ljg5QzIxNy45NjcgNDQ5LjE3NCAxOTMuODA1IDM0MS41MjMgODcuNTMwMyAyNzYuNzcyQy01My45MDc0IDE5MC41NzEgNTguMDY0MSA0ODcuMjYyIDU4LjA2NDEgNDg3LjI2MkwyOC43OTQzIDUwNC41MDNDMTguOTcyMyA1MTAuMzE2IDIzLjA5NzUgNTI1LjM1MSAzNC4yOTQ3IDUyNS4zNTFIMjAwLjI4OFoiIGZpbGw9IiMzMkRBNkQiLz4KPHBhdGggZD0iTTYyMi4zNDMgNTI1LjM1MUM2MDkuNzcxIDUyNS4zNTEgNTk5Ljk0OSA1MTIuOTIyIDYwMS4zMjQgNDk4Ljg5QzYwNi4yMzUgNDQ5LjM3NCA2MjguMjM2IDM0MS41MjMgNzI0LjEgMjc2Ljc3MkM4NTEuOTgzIDE5MC41NzEgNzUwLjgxNiA0ODcuMjYyIDc1MC44MTYgNDg3LjI2Mkw3NzcuMzM1IDUwNC41MDNDNzg2LjE3NSA1MTAuMzE2IDc4Mi40NDMgNTI1LjM1MSA3NzIuNDI0IDUyNS4zNTFINjIyLjM0M1oiIGZpbGw9IiMzMkRBNkQiLz4KPHBhdGggZD0iTTIzNS4wMTcgMTMyLjI4OEMyNDEuNTI2IDEzMi4yODggMjQ2LjgwMyAxMjYuOTAzIDI0Ni44MDMgMTIwLjI2QzI0Ni44MDMgMTEzLjYxNyAyNDEuNTI2IDEwOC4yMzIgMjM1LjAxNyAxMDguMjMyQzIyOC41MDcgMTA4LjIzMiAyMjMuMjMgMTEzLjYxNyAyMjMuMjMgMTIwLjI2QzIyMy4yMyAxMjYuOTAzIDIyOC41MDcgMTMyLjI4OCAyMzUuMDE3IDEzMi4yODhaIiBmaWxsPSIjMEQwRDBEIi8+CjxwYXRoIGQ9Ik01ODAuNTg5IDEzMi4yODhDNTg3LjA5OSAxMzIuMjg4IDU5Mi4zNzYgMTI2LjkwMyA1OTIuMzc2IDEyMC4yNkM1OTIuMzc2IDExMy42MTcgNTg3LjA5OSAxMDguMjMyIDU4MC41ODkgMTA4LjIzMkM1NzQuMDggMTA4LjIzMiA1NjguODAzIDExMy42MTcgNTY4LjgwMyAxMjAuMjZDNTY4LjgwMyAxMjYuOTAzIDU3NC4wOCAxMzIuMjg4IDU4MC41ODkgMTMyLjI4OFoiIGZpbGw9IiMwRDBEMEQiLz4KPC9nPgo8cmVjdCB5PSI1ODYiIHdpZHRoPSI4MDUiIGhlaWdodD0iMzEwIiBmaWxsPSIjQUM0QkZGIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMjM2NF8zMzc1NSI+CjxyZWN0IHdpZHRoPSI4MDUiIGhlaWdodD0iODA1IiByeD0iMTQ0LjkiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjxjbGlwUGF0aCBpZD0iY2xpcDFfMjM2NF8zMzc1NSI+CjxyZWN0IHdpZHRoPSI3NzIuOCIgaGVpZ2h0PSI1MTUuMiIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2IDE4KSIvPgo8L2NsaXBQYXRoPgo8L2RlZnM+Cjwvc3ZnPgo=";

// src/extension/registry.ts
var leapExtensionInfo = {
  name: "leap-extension",
  prettyName: "Leap",
  logo: ICON,
  mode: "extension",
  mobileDisabled: true,
  rejectMessage: {
    source: "Request rejected"
  },
  connectEventNamesOnWindow: ["leap_keystorechange"],
  downloads: [
    {
      device: "desktop",
      browser: "chrome",
      link: "https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg"
    },
    {
      link: "https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg"
    }
  ]
};

// src/leap.ts
var leapExtension = new LeapExtensionWallet(leapExtensionInfo);
var wallets = [leapExtension];
export {
  ChainLeapExtension,
  LeapExtensionWallet,
  leapExtensionInfo,
  wallets
};
//# sourceMappingURL=index.mjs.map