import { getMockFromExtension } from '../mock-extension/extension/utils';

// Example of using getMockFromExtension in an application setting
export async function setupWallet() {
  try {
    const wallet = await getMockFromExtension();
    // Proceed with using the wallet
    console.log('Wallet enabled:', wallet.mode);
  } catch (error) {
    console.error('Failed to get wallet:', error);
  }
}
