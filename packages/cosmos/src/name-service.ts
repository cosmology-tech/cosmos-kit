import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { NameServiceRegistry, NameService } from '@cosmos-kit/core';

export class CosmosNameService implements NameService {
  client: CosmWasmClient;
  registry: NameServiceRegistry;

  constructor(client: CosmWasmClient, registry: NameServiceRegistry) {
    this.client = client;
    this.registry = registry;
  }

  async resolveName(address: string): Promise<any> {
    try {
      const { contract, getQueryMsg } = this.registry;
      const result = await this.client.queryContractSmart(
        contract,
        getQueryMsg(address)
      );
      return result;
    } catch (e) {
      console?.error(e);
      return undefined;
    }
  }
}
