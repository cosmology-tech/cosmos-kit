import { getMockFromExtension } from '../src/mock-extension/extension/utils';
import { MockWallet } from '../src/mocker';
import { getChainInfoByChainId, initActiveWallet } from '../src/utils';

describe('Wallet functionality', () => {
  const wallet = new MockWallet();

  it('should handle key retrieval', async () => {
    const chain = getChainInfoByChainId('cosmoshub-4');

    await initActiveWallet([chain]);

    const key = await wallet.getKey(chain.chain_id);
    expect(key.bech32Address.startsWith('cosmos')).toBe(true);
  });

  // Add more tests as needed
  //
});

describe('getMockFromExtension', () => {
  // it('returns the provided mock', async () => {
  //   const mock = new MockWallet();
  //   // @ts-ignore
  //   const result = await getMockFromExtension({ mock });
  //   expect(result).toEqual(mock);
  // });

  it('instantiates MockWallet if no mock is provided', async () => {
    const result = await getMockFromExtension();
    expect(result).toBeInstanceOf(MockWallet);
  });

  it('should be only one MockWallet instance in an environment', async () => {
    const result = await getMockFromExtension();
    const mock = await getMockFromExtension();
    expect(result).toBe(mock);
  });
});
