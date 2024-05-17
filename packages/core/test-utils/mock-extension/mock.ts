import { mockExtensionInfo, MockExtensionWallet } from './extension';

const mockExtension = new MockExtensionWallet(mockExtensionInfo);

export const wallets = [mockExtension];
