import { MockWallet } from '../../mocker'; // Ensure this path is correct
import { Mock } from './types';

interface MockWindow {
  mock?: Mock;
}

let mockWallet = null;
export const getMockFromExtension: (
  mockWindow?: MockWindow
) => Promise<MockWallet> = async (_window: any) => {
  if (!mockWallet) {
    mockWallet = new MockWallet();
  }

  return mockWallet;
};
