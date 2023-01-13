import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { useChain, useWallet } from '@cosmos-kit/react';
import useSWR from 'swr';

export const ICNS_RESOLVER_CONTRACT_ADDRESS =
  'osmo1xk0s8xgktn9x5vwcgtjdxqzadg88fgn33p8u9cnpdxwemvxscvast52cdd';

// The response from the ICNS resolver contract.
export type IcnsNamesResponse = {
  // The primary name of the address. In case the addess has multiple names.
  // This name should be used for primary display if there is no specific need.
  primaryName: string;

  // All the names associated with the address.
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
export const resolveIcnsName = async (
  cosmwasmClient: CosmWasmClient,
  address: string
): Promise<IcnsNamesResponse> => {
  const { primary_name, names } = await cosmwasmClient.queryContractSmart(
    ICNS_RESOLVER_CONTRACT_ADDRESS,
    {
      icns_names: { address },
    }
  );

  return {
    primaryName: primary_name,
    names,
  };
};

/**
 * @param swrNamespace - namespace for swr cache key
 * @returns icnsNames - ICNS names
 * @returns isLoading - whether or not the data is still loading
 * @returns error - any error that may have occurred
 */
export const useIcnsNames = (
  swrNamespace = 'cosmos-kit/icns/resolver/icns-names'
): {
  icnsNames: IcnsNamesResponse;
  isLoading: boolean;
  error: unknown | undefined;
} => {
  const { address } = useWallet();
  const osmosis = useChain('osmosis');
  const { data, error, isLoading } = useSWR(
    `${swrNamespace}/${address}`,
    async () => {
      const client = await osmosis.getCosmWasmClient();
      return resolveIcnsName(client, address);
    }
  );

  return {
    icnsNames: data,
    error,
    isLoading,
  };
};
