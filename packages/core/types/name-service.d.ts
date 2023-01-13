import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Bech32Address, NameServiceRegistry } from './types';
export declare class NameService {
    client: CosmWasmClient;
    registry: NameServiceRegistry | undefined;
    constructor(client: CosmWasmClient, registry: NameServiceRegistry);
    resolveName(address: Bech32Address): Promise<any | undefined>;
}
