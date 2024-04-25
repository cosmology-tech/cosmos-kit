import { WalletManager, Logger, ChainRecord, Session } from '@cosmos-kit/core';
import { chains, assets } from 'chain-registry';
import { MockExtensionWallet } from '../src/mock-extension/extension';
import { mockExtensionInfo as walletInfo } from '../src/mock-extension/extension/registry';

const logger = new Logger(); function logoutUser() {
  console.log('Session expired. Logging out user.');
  // Code to log out user
}

// Session duration set for 30 minutes
const userSession = new Session({
  duration: 30 * 60 * 1000, // 30 minutes in milliseconds
  callback: logoutUser
});

// Start the session when the user logs in
userSession.update();

const mainWalletBase = new MockExtensionWallet(walletInfo)

describe('WalletManager', () => {
  let walletManager: WalletManager;

  beforeEach(() => {
    walletManager = new WalletManager(
      chains,
      [mainWalletBase],
      logger,
      true, // throwErrors
      true, // subscribeConnectEvents
      false // disableIframe
    );
  });

  it('should initialize with provided configurations', () => {
    expect(walletManager.throwErrors).toBe(true);
    expect(walletManager.subscribeConnectEvents).toBe(true);
    expect(walletManager.disableIframe).toBe(false);
    expect(walletManager.chainRecords).toHaveLength(2); // Assuming `convertChain` is mocked
  });

  it('should handle onMounted lifecycle correctly', async () => {
    // Mock environment parser
    jest.mock('Bowser', () => ({
      getParser: () => ({
        getBrowserName: jest.fn().mockReturnValue('chrome'),
        getPlatform: jest.fn().mockReturnValue({ type: 'desktop' }),
        getOSName: jest.fn().mockReturnValue('windows')
      })
    }));

    await walletManager.onMounted();

    expect(walletManager.walletRepos).toHaveLength(2); // Depends on internal logic
    expect(logger.debug).toHaveBeenCalled(); // Check if debug logs are called
  });

  // Add more tests as needed for each method
});
