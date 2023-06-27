// src/name-service.ts
var NameService = class {
  constructor(client, registry) {
    this.client = client;
    this.registry = registry;
  }
  async resolveName(address) {
    try {
      const { contract, getQueryMsg } = this.registry;
      const result = await this.client.queryContractSmart(
        contract,
        getQueryMsg(address)
      );
      return result;
    } catch (e) {
      console?.error(e);
      return void 0;
    }
  }
};
export {
  NameService
};
//# sourceMappingURL=name-service.mjs.map