var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ChainExodusExtension: () => ChainExodusExtension,
  ExodusClient: () => ExodusClient,
  ExodusExtensionWallet: () => ExodusExtensionWallet,
  exodusExtensionInfo: () => exodusExtensionInfo,
  wallets: () => wallets
});
module.exports = __toCommonJS(src_exports);

// src/config.ts
var preferredEndpoints = {
  osmosis: {
    rpc: ["https://atom4.a.exodus.io/api"]
  }
};

// src/extension/chain-wallet.ts
var import_core = require("@cosmos-kit/core");
var ChainExodusExtension = class extends import_core.ChainWalletBase {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo);
  }
};

// src/extension/main-wallet.ts
var import_core3 = require("@cosmos-kit/core");

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
var import_core2 = require("@cosmos-kit/core");
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
      throw import_core2.ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (exodus) {
          resolve(exodus);
        } else {
          reject(import_core2.ClientNotExistError.message);
        }
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };
    document.addEventListener("readystatechange", documentStateChange);
  });
};

// src/extension/main-wallet.ts
var ExodusExtensionWallet = class extends import_core3.MainWalletBase {
  constructor(walletInfo, preferredEndpoints2) {
    super(walletInfo, ChainExodusExtension);
    this.preferredEndpoints = preferredEndpoints2;
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

// src/extension/registry.ts
var import_go = require("react-icons/go");
var import_ri = require("react-icons/ri");

// src/constant.ts
var ICON = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yOTguMjAzIDgzLjc2NDVMMTcwLjQ0OSAwVjQ2LjgzMzJMMjUyLjQwNSAxMDAuMDg5TDI0Mi43NjMgMTMwLjU5OEgxNzAuNDQ5VjE2OS40MDJIMjQyLjc2M0wyNTIuNDA1IDE5OS45MTFMMTcwLjQ0OSAyNTMuMTY3VjMwMEwyOTguMjAzIDIxNi41MDNMMjc3LjMxMyAxNTAuMTM0TDI5OC4yMDMgODMuNzY0NVoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xNjYxXzI5NSkiLz4KPHBhdGggZD0iTTU5LjMwMDcgMTY5LjQwMkgxMzEuMzQ2VjEzMC41OThINTkuMDMyOUw0OS42NTg5IDEwMC4wODlMMTMxLjM0NiA0Ni44MzMyVjBMMy41OTI1MyA4My43NjQ1TDI0LjQ4MzEgMTUwLjEzNEwzLjU5MjUzIDIxNi41MDNMMTMxLjYxNCAzMDBWMjUzLjE2N0w0OS42NTg5IDE5OS45MTFMNTkuMzAwNyAxNjkuNDAyWiIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzE2NjFfMjk1KSIvPgo8bWFzayBpZD0ibWFzazBfMTY2MV8yOTUiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjMiIHk9IjAiIHdpZHRoPSIyOTYiIGhlaWdodD0iMzAwIj4KPHBhdGggZD0iTTI5OC4yMDQgODMuNzY0NUwxNzAuNDUgMFY0Ni44MzMyTDI1Mi40MDUgMTAwLjA4OUwyNDIuNzYzIDEzMC41OThIMTcwLjQ1VjE2OS40MDJIMjQyLjc2M0wyNTIuNDA1IDE5OS45MTFMMTcwLjQ1IDI1My4xNjdWMzAwTDI5OC4yMDQgMjE2LjUwM0wyNzcuMzEzIDE1MC4xMzRMMjk4LjIwNCA4My43NjQ1WiIgZmlsbD0idXJsKCNwYWludDJfbGluZWFyXzE2NjFfMjk1KSIvPgo8cGF0aCBkPSJNNTkuMzAxIDE2OS40MDJIMTMxLjM0N1YxMzAuNTk4SDU5LjAzMzJMNDkuNjU5MiAxMDAuMDg5TDEzMS4zNDcgNDYuODMzMlYwTDMuNTkyNzcgODMuNzY0NUwyNC40ODM0IDE1MC4xMzRMMy41OTI3NyAyMTYuNTAzTDEzMS42MTUgMzAwVjI1My4xNjdMNDkuNjU5MiAxOTkuOTExTDU5LjMwMSAxNjkuNDAyWiIgZmlsbD0idXJsKCNwYWludDNfbGluZWFyXzE2NjFfMjk1KSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazBfMTY2MV8yOTUpIj4KPHJlY3QgeD0iMy43NTAyNCIgd2lkdGg9IjI5Mi41IiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNwYWludDRfbGluZWFyXzE2NjFfMjk1KSIvPgo8L2c+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMTY2MV8yOTUiIHgxPSIyNTYuODc1IiB5MT0iMzIwLjYyNSIgeDI9IjE3MS4zIiB5Mj0iLTMyLjk0NTkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzBCNDZGOSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNCQkZCRTAiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzE2NjFfMjk1IiB4MT0iMjU2Ljg3NSIgeTE9IjMyMC42MjUiIHgyPSIxNzEuMyIgeTI9Ii0zMi45NDU5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMwQjQ2RjkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQkJGQkUwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQyX2xpbmVhcl8xNjYxXzI5NSIgeDE9IjI1Ni44NzUiIHkxPSIzMjAuNjI1IiB4Mj0iMTcxLjMiIHkyPSItMzIuOTQ1OSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMEI0NkY5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0JCRkJFMCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50M19saW5lYXJfMTY2MV8yOTUiIHgxPSIyNTYuODc1IiB5MT0iMzIwLjYyNSIgeDI9IjE3MS4zIiB5Mj0iLTMyLjk0NTkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzBCNDZGOSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNCQkZCRTAiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDRfbGluZWFyXzE2NjFfMjk1IiB4MT0iMjIuNTAwMiIgeTE9IjY3LjUiIHgyPSIxNzAuNjI1IiB5Mj0iMTc4LjEyNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBvZmZzZXQ9IjAuMTE5NzkyIiBzdG9wLWNvbG9yPSIjODk1MkZGIiBzdG9wLW9wYWNpdHk9IjAuODciLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjREFCREZGIiBzdG9wLW9wYWNpdHk9IjAiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K";

// src/extension/registry.ts
var exodusExtensionInfo = {
  name: "exodus-extension",
  prettyName: "Exodus",
  logo: ICON,
  mode: "extension",
  mobileDisabled: true,
  rejectMessage: {
    source: "Request rejected"
  },
  connectEventNamesOnWindow: ["exodus_keystorechange"],
  downloads: [
    {
      device: "desktop",
      browser: "chrome",
      icon: import_ri.RiChromeFill,
      link: "https://chrome.google.com/webstore/detail/exodus-web3-wallet/aholpfdialjgjfhomihkjbmgjidlcdno"
    },
    {
      icon: import_go.GoDesktopDownload,
      link: "https://www.exodus.com/download"
    }
  ]
};

// src/exodus.ts
var exodusExtension = new ExodusExtensionWallet(
  exodusExtensionInfo,
  preferredEndpoints
);
var wallets = [exodusExtension];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChainExodusExtension,
  ExodusClient,
  ExodusExtensionWallet,
  exodusExtensionInfo,
  wallets
});
//# sourceMappingURL=index.js.map