import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { fromBech32, toBech32 } from '@cosmjs/encoding';

const NAMES_CONTRACT =
  'stars1fx74nkqkw2748av8j7ew7r3xt9cgjqduwn8m0ur5lhe49uhlsasszc5fhr';

let client = null;
const getClient = () => {
  if (client) return client;
  return CosmWasmClient.connect('https://rpc.cosmos.directory/osmosis');
};

export async function resolveName(address: string) {
  try {
    if (!address.startsWith('stars')) {
      const { data } = fromBech32(address);
      address = toBech32('stars', data);
    }

    const client = await getClient();
    const name = await client.queryContractSmart(NAMES_CONTRACT, {
      name: { address },
    });
    return `${name}.stars`;
  } catch {
    // query throws on missing
    return undefined;
  }
}
