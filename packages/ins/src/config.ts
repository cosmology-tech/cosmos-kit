import { NameServiceRegistry } from './name-service';

export const nameServiceRegistries: NameServiceRegistry = [
  {
    name: 'icns',
    contract: 'osmo1xk0s8xgktn9x5vwcgtjdxqzadg88fgn33p8u9cnpdxwemvxscvast52cdd',
    chainName: 'osmosis',
    getNameQueryMsg: (address: string) => {
      return {
        icns_names: { address },
      };
    },
    getAddressQueryMsg: (name: string, bech32_prefix?: string) => {
      return {
        address: {
          name,
          bech32_prefix: bech32_prefix || 'osmo',
        },
      };
    },
    normalizeAddressResponse: (response): string => {
      return response.address;
    },
    normalizeNameResponse: (response): string => {
      return response.primary_name;
    },
    slip173: 'osmo',
  },
  {
    name: 'sns',
    contract:
      'stars1fx74nkqkw2748av8j7ew7r3xt9cgjqduwn8m0ur5lhe49uhlsasszc5fhr',
    chainName: 'stargaze',
    getNameQueryMsg: (address: string) => {
      return {
        name: { address },
      };
    },
    getAddressQueryMsg: (name: string, bech32_prefix?: string) => {
      // Stargaze names currtently don't support bech32_prefix?
      return {
        associated_address: {
          name,
        },
      };
    },
    normalizeAddressResponse: (response): string => {
      return response;
    },
    normalizeNameResponse: (response): string => {
      return response;
    },
    slip173: 'stars',
  },
];
