import { MockWallet } from '../src/mocker';

describe('Wallet functionality', () => {
  const wallet = new MockWallet();

  it('should handle key retrieval', async () => {
    const key = await wallet.getKey('cosmos');
    expect(key.bech32Address).toBe('cosmos1...');
  });

  // Add more tests as needed
});
