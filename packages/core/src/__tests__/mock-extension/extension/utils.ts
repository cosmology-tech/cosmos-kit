import { MockWallet } from '../../mocker'; // Ensure this path is correct
import { Mock } from './types';

interface MockWindow {
  mock?: Mock;
}

export const getMockFromExtension: (
  mockWindow?: MockWindow
) => Promise<MockWallet> = async (_window: any) => {
  return new MockWallet();
};
