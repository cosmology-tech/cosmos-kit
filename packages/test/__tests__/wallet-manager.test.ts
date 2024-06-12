import { WalletManager, Logger } from '../../core';
import { chains, assets } from 'chain-registry';
import { Chain } from '@chain-registry/types';
import { MockExtensionWallet } from '../src/mock-extension';
import { mockExtensionInfo as walletInfo } from '../src/mock-extension/extension/registry';
import { getChainWalletContext } from '../../react-lite/src/utils';
import { init, Wallet } from '../src/mock-extension/extension/utils';
import { MockWallet } from '../src/mocker/index';
import { MockClient } from '../src/mock-extension/extension/client';

// Mock global window object
// @ts-ignore
global.window = {
  // @ts-ignore
  localStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  // @ts-ignore
  navigator: { userAgent: 'mock' },
  addEventListener: jest.fn(),
};

const logger = new Logger();
function logoutUser() {
  console.log('Session expired. Logging out user.');
  // Code to log out user
}

// Session duration set for 30 minutes
// const userSession = new Session({
//   duration: 30 * 60 * 1000, // 30 minutes in milliseconds
//   callback: logoutUser,
// });

// Start the session when the user logs in
// userSession.update();

let client: MockClient, initialChain: Chain, walletManager: WalletManager;

const mainWalletBase = new MockExtensionWallet(walletInfo);

const startIndex = 8;
const endIndex = 10;
const initChainsCount = endIndex - startIndex;
beforeAll(async () => {
  const enabledChains = chains.slice(startIndex, endIndex);
  initialChain = enabledChains[0];

  await init(enabledChains);

  walletManager = new WalletManager(
    enabledChains,
    [mainWalletBase],
    logger,
    true, // throwErrors
    true, // subscribeConnectEvents
    false, // disableIframe
    assets // assetLists
  );
});

describe('WalletManager', () => {
  it('should initialize with provided configurations', () => {
    expect(walletManager.throwErrors).toBe(true);
    expect(walletManager.subscribeConnectEvents).toBe(true);
    expect(walletManager.disableIframe).toBe(false);
    expect(walletManager.chainRecords).toHaveLength(initChainsCount); // Assuming `convertChain` is mocked
  });

  it('should handle onMounted lifecycle correctly', async () => {
    // Mock environment parser
    // jest.mock('Bowser', () => ({
    //   getParser: () => ({
    //     getBrowserName: jest.fn().mockReturnValue('chrome'),
    //     getPlatform: jest.fn().mockReturnValue({ type: 'desktop' }),
    //     getOSName: jest.fn().mockReturnValue('windows'),
    //   }),
    // }));

    expect(walletManager.walletRepos).toHaveLength(initChainsCount); // Depends on internal logic
    // expect(logger.debug).toHaveBeenCalled(); // Check if debug logs are called
  });

  it('should active wallet', async () => {
    await walletManager.onMounted();

    const walletRepo = walletManager.getWalletRepo(initialChain.chain_name);
    const chainWallet = walletManager.getChainWallet(
      initialChain.chain_name,
      'mock-extension'
    );
    walletRepo.activate();
    await chainWallet.connect();

    expect(walletRepo.isActive).toBe(true);
    expect(chainWallet.isActive).toBe(true);
    expect(chainWallet.isWalletConnected).toBe(true);
    expect(chainWallet.address.length).toBeGreaterThan(20);

    const context = getChainWalletContext(initialChain.chain_id, chainWallet);
    // @ts-ignore
    client = context.chainWallet.client;

    expect(context.wallet.name).toBe('mock-extension');
  });

  it('should suggest chain', async () => {
    const suggestChain: Chain = chains[6];

    const newKeystore = (await client.addChain({
      name: suggestChain.chain_name,
      chain: suggestChain,
      assetList: assets.find(
        ({ chain_name }) => chain_name === suggestChain.chain_name
      ),
    })) as unknown as Record<string, Wallet>;

    walletManager.addChains([suggestChain], assets);

    const walletRepos = walletManager.walletRepos;
    const mainWallet = walletManager.getMainWallet('mock-extension');
    const chainWalletMap = mainWallet.chainWalletMap;

    expect(walletManager.chainRecords).toHaveLength(initChainsCount + 1);
    expect(walletRepos).toHaveLength(initChainsCount + 1);
    expect(chainWalletMap.size).toBe(initChainsCount + 1);


    const newWalletRepo = walletManager.getWalletRepo(suggestChain.chain_name);
    const newChainWallet = newWalletRepo.getWallet('mock-extension');
    newWalletRepo.activate();
    await newChainWallet.connect();

    expect(
      Object.values(newKeystore)[0].addresses[suggestChain.chain_id]
    ).toEqual(newChainWallet.address);

    // console.log(
    //   Object.values(newKeystore)[0].addresses,
    //   chainWalletMap.get(initialChain.chain_name).address,
    //   newChainWallet.address
    // );
  });

  it('should suggest token', async () => {
    const suggestToken: Chain = chains[6];
  });
});
