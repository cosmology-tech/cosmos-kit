import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
export declare const ICNS_RESOLVER_CONTRACT_ADDRESS = "osmo1xk0s8xgktn9x5vwcgtjdxqzadg88fgn33p8u9cnpdxwemvxscvast52cdd";
export declare type IcnsNamesResponse = {
    primaryName: string;
    names: string[];
};
/**
 * This function queries the ICNS resolver contract to get the names associated
 * with an address.
 *
 * Each bech32 prefix resulted in different suffixes. For example:
 *   - osmos1addr1 -> name.osmo
 *   - juno1addr1 -> name.juno
 *
 * @param cosmwasmClient The CosmWasm client.
 * @param address The address to query.
 * @returns The icns names associated with the address. Including primary name.
 */
export declare const resolveIcnsName: (cosmwasmClient: CosmWasmClient, address: string) => Promise<IcnsNamesResponse>;
/**
 * @param swrNamespace - namespace for swr cache key
 * @returns icnsNames - ICNS names
 * @returns isLoading - whether or not the data is still loading
 * @returns error - any error that may have occurred
 */
export declare const useIcnsNames: (swrNamespace?: string) => {
    icnsNames: IcnsNamesResponse;
    isLoading: boolean;
    error: unknown | undefined;
};
