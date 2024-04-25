import { getMockFromExtension } from '../src/mock-extension/extension/utils';
import { MockWallet } from '../src/mocker';

describe('Wallet functionality', () => {
  const wallet = new MockWallet();

  it('should handle key retrieval', async () => {
    const key = await wallet.getKey('cosmos');
    expect(key.bech32Address).toBe('cosmos1...');
  });

  // Add more tests as needed
});

describe('getMockFromExtension', () => {
  it('returns the provided mock', async () => {
    const mock = new MockWallet();
    // @ts-ignore
    const result = await getMockFromExtension({ mock });
    expect(result).toEqual(mock);
  });

  it('instantiates MockWallet if no mock is provided', async () => {
    const result = await getMockFromExtension();
    expect(result).toBeInstanceOf(MockWallet);
  });
});
