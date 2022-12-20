import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { fromBech32, toBech32 } from '@cosmjs/encoding';

let client = null;
const getClient = () => {
  if (client) return client;
  return CosmWasmClient.connect('https://rpc.cosmos.directory/stargaze');
};

export async function resolveName(address: string) {
  if (!address.startsWith('stars')) {
    const { data } = fromBech32(address);
    address = toBech32('stars', data);
  }

  const client = await getClient();
  return client
    .queryContractSmart(
      'stars1fx74nkqkw2748av8j7ew7r3xt9cgjqduwn8m0ur5lhe49uhlsasszc5fhr',
      { name: { address } }
    )
    .catch(() => undefined)
    .then((name) => `${name}.stars`);
}
