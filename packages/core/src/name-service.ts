import type { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Bech32Address, NameServiceRegistry } from './types';

export class NameService {
  client: CosmWasmClient;
  registry: NameServiceRegistry;

  constructor(client: CosmWasmClient, registry: NameServiceRegistry) {
    this.client = client;
    this.registry = registry;
  }

  async resolveName(address: Bech32Address): Promise<any | undefined> {
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
