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
export {
  ExodusClient
};
//# sourceMappingURL=client.mjs.map