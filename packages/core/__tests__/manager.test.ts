import { WalletConnectOptions } from './../src/types/wallet';
import { EndpointOptions, SessionOptions, SignerOptions } from './../src/types/manager';
import { assets } from 'chain-registry';
import { MainWalletBase } from '../src/bases';
import { WalletManager } from '../src/manager';
import { convertChain, Logger, WalletNotProvidedError } from '../src/utils';
import { EventEmitter } from 'stream';
import { wallets } from '../test-utils/mock-extension';
import { WalletRepo } from '../src/repository';

const getLogo = (chainName: string) => {
  const asset = assets.find(a => a.chain_name === chainName);
  return asset?.assets[0].logo_URIs?.svg || asset?.assets[0].logo_URIs?.png || undefined
}

function storageMock() {
  let storage = {};

  return {
    setItem: function (key, value) {
      storage[key] = value || '';
    },
    getItem: function (key) {
      return key in storage ? storage[key] : null;
    },
    removeItem: function (key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: function (i) {
      const keys = Object.keys(storage);
      return keys[i] || null;
    }
  };
}

const storageMockInstance = storageMock()

// Mock global window object
global.window = {
  // @ts-ignore
  localStorage: storageMockInstance,
  dispatchEvent: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  navigator: {
    userAgent: 'jest'
  } as any
}


jest.mock('bowser', () => {
  const originalModule = jest.requireActual('bowser')
  return {
    ...originalModule,
    getParser: jest.fn().mockReturnValue({
      getBrowserName: jest.fn().mockReturnValue('firefox'),
      getOSName: jest.fn().mockReturnValue('windows'),
      getPlatform: jest.fn().mockReturnValue({ type: 'mobile' }),
    })
  }
})

describe('WalletManager', () => {

  let chainNames = ['osmosis', 'juno']
  let walletManager: WalletManager;
  let throwErrors = true
  let subscribeConnectEvents = true
  let allowedCosmiframeParentOrigins: string[] = []
  let logger = new Logger()
  let sessionOptions: SessionOptions = { duration: 100 }
  let NameServiceName = 'testNameServiceName'
  let walletConnectOptions: WalletConnectOptions = {
    signClient: { projectId: 'testProjectId' }
  }
  let signerOptions: SignerOptions = {}
  let endpointOptions: EndpointOptions = {
    isLazy: true,
  }

  const walletMock = wallets[0]
  const mainWallets: MainWalletBase[] = [walletMock]
  const getNameServiceRegistryFromNameMock = jest.fn()
  beforeEach(() => {

    jest.mock('../src/utils', () => ({
      getNameServiceRegistryFromName: getNameServiceRegistryFromNameMock
    }))


    walletManager = new WalletManager(
      chainNames,
      mainWallets,
      logger,
      throwErrors,
      subscribeConnectEvents,
      allowedCosmiframeParentOrigins,
      assets,
      NameServiceName,
      walletConnectOptions,
      signerOptions,
      endpointOptions,
      sessionOptions
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should have right instance', () => {
    expect(walletManager.throwErrors).toBeTruthy()
    expect(walletManager.logger).toBe(logger)
    expect(walletManager.coreEmitter).toBeInstanceOf(EventEmitter)
    expect(walletManager.defaultNameService).toBe(NameServiceName)
    expect(walletManager.walletConnectOptions).toBe(walletConnectOptions)
  })

  it('should initialize wallet manager', () => {

    jest.spyOn(walletMock, 'setChains')

    walletManager.init(
      chainNames,
      assets,
      mainWallets,
      walletConnectOptions,
      signerOptions,
      endpointOptions
    );

    expect(walletManager.isLazy).toBe(endpointOptions.isLazy)
    expect(walletManager.chainRecords).toMatchObject(chainNames.map(c => convertChain(c, assets, {}, {}, endpointOptions.isLazy)))
    walletManager.mainWallets.forEach(w => {
      expect(w.logger).toBe(walletManager.logger)
      expect(w.throwErrors).toBe(walletManager.throwErrors)
      expect(w.session).toBe(walletManager.session)
      expect(w.walletConnectOptions).toBe(walletManager.walletConnectOptions)
      expect(w.setChains).toBeCalledWith(walletManager.chainRecords)
    })
  });

  it('should set wallet repel value', () => {
    const value = false;

    jest.spyOn(window.localStorage, 'setItem')

    walletManager.setWalletRepel(value);
    expect(walletManager.repelWallet).toBe(value);
    walletManager.walletRepos.forEach((repo) => {
      expect(repo.repelWallet).toBe(value);
    })

    expect(window.localStorage.setItem).toBeCalledWith("cosmos-kit@2:core//repel-wallet", value.toString())
  });

  it('should add endpoints', () => {
    jest.spyOn(walletMock, 'addEnpoints')

    const endpoints: EndpointOptions['endpoints'] = {
      'chain1': {
        rest: ['http://rest.localhost:1317'],
        rpc: ['http://rpc.localhost:26657']
      },
      'chain2': {
        rest: ['http://rest.localhost:1317'],
        rpc: ['http://rpc.localhost:26657']
      }
    };

    walletManager.addEndpoints(endpoints);

    walletManager.mainWallets.forEach(mw => {
      expect(mw.addEnpoints).toBeCalledWith(endpoints)
    })
  });

  // it('should addChains functional', () => {
  //   walletManager.addChains(['osmosis'], assets);
  //   expect(walletManager.chainRecords).toHaveLength(2)
  //   expect(walletManager.walletRepos).toHaveLength(2)
  //   walletManager.addChains(['stargaze'], assets);
  //   expect(walletManager.chainRecords).toHaveLength(3)
  //   expect(walletManager.walletRepos).toHaveLength(3)
  // });

  it('should register event handlers with on()', () => {
    const event = 'refresh_connection';
    const handler = jest.fn();
    walletManager.on(event, handler);
    expect(walletManager.coreEmitter.listenerCount(event)).toBe(1);
    expect(walletManager.coreEmitter.listeners(event)).toContain(handler);
  });

  it('should unregister event handlers with off()', () => {
    const event = 'refresh_connection';
    const handler = jest.fn();
    walletManager.on(event, handler);
    walletManager.off(event, handler);
    expect(walletManager.coreEmitter.listenerCount(event)).toBe(0);
    expect(walletManager.coreEmitter.listeners(event)).not.toContain(handler);
  });

  it('should activeRepos return right active wallet repose', () => {
    const walletRepos: WalletRepo[] = [{ isActive: true }, { isActive: false }, { isActive: true }] as any
    walletManager.walletRepos = walletRepos;
    expect(walletManager.activeRepos).toHaveLength(2)
  });

  it('should getMainWallet return right wallet', () => {
    const chainName1 = 'mock-extension';
    const mainWallet1 = walletManager.getMainWallet(chainName1);
    expect(mainWallet1).toBe(walletMock);

    const chainName2 = 'mock-extension-non-existent';
    expect(() => walletManager.getMainWallet(chainName2)).toThrowError(new WalletNotProvidedError('mock-extension-non-existent'))
  });

  it('should getWalletRepo return right wallet repo', () => {
    const chainName1 = 'osmosis';
    const walletRepo1 = walletManager.getWalletRepo(chainName1);
    expect(walletRepo1).toBeInstanceOf(WalletRepo);
    expect(walletRepo1.chainName).toBe(chainName1);
    const chainName2 = 'juno';
    const walletRepo2 = walletManager.getWalletRepo(chainName2);
    expect(walletRepo2).toBeInstanceOf(WalletRepo);
    expect(walletRepo2.chainName).toBe(chainName2);
    const chainName3 = 'non-existent-chain';
    expect(() => walletManager.getWalletRepo(chainName3)).toThrowError(new Error(`Chain ${chainName3} is not provided.`));
  });

  it('should getChainWallet return right chain wallet', () => {
    const chainName1 = 'osmosis';
    const walletName1 = 'mock-extension';
    const chainWallet1 = walletManager.getChainWallet(chainName1, walletName1);
    expect(chainWallet1.chainName).toBe(chainName1);
    expect(chainWallet1.walletName).toBe(walletName1);

    const chainName2 = 'juno';
    const walletName2 = 'mock-extension';
    const chainWallet2 = walletManager.getChainWallet(chainName2, walletName2);
    expect(chainWallet2.chainName).toBe(chainName2);
    expect(chainWallet2.walletName).toBe(walletName2);

    const chainName3 = 'non-existent-chain';
    const walletName3 = 'mock-extension';
    expect(() => walletManager.getChainWallet(chainName3, walletName3)).toThrowError(new Error(`${chainName3} is not provided!`));
    const chainName4 = 'osmosis';
    const walletName4 = 'non-existent-wallet';
    expect(() => walletManager.getChainWallet(chainName4, walletName4)).toThrowError(new WalletNotProvidedError('non-existent-wallet'));
  });

  it('should getChainRecord return right chain record', () => {
    const chainName1 = 'osmosis';
    const chainRecord1 = walletManager.getChainRecord(chainName1);
    expect(chainRecord1.name).toBe(chainName1);
    const chainName2 = 'juno';
    const chainRecord2 = walletManager.getChainRecord(chainName2);
    expect(chainRecord2.name).toBe(chainName2);
    const chainName3 = 'non-existent-chain';
    expect(() => walletManager.getChainRecord(chainName3)).toThrowError(new Error(`${chainName3} is not provided!`));
  });

  it('should getChainLog return right logo url', () => {
    const chainName1 = 'osmosis';
    const logo1 = getLogo(chainName1) as string
    const chainLogo1 = walletManager.getChainLogo(chainName1);
    expect(chainLogo1).toBe(logo1);

    const chainName2 = 'juno';
    const logo2 = getLogo(chainName2) as string
    const chainLogo2 = walletManager.getChainLogo(chainName2);
    expect(chainLogo2).toBe(logo2);
  });

  it('should getNameService return the error for unknown NameService', async () => {
    getNameServiceRegistryFromNameMock.mockReturnValue(undefined)
    await expect(walletManager.getNameService()).rejects.toThrowError(new Error('Unknown defaultNameService testNameServiceName'))

    getNameServiceRegistryFromNameMock.mockReturnValue({ chainName: 'osmosis' })
    jest.spyOn(walletManager, 'getWalletRepo').mockImplementation(() => {
      return {
        getNameService: jest.fn()
      } as any
    })
    await walletManager.getNameService()
    expect(walletManager.getWalletRepo).toBeCalledWith('osmosis')

    await walletManager.getNameService('test')
    expect(walletManager.getWalletRepo).toBeCalledWith('test')
  });

  // it('should handle Cosmiframe Keystore Change Event', () => {
  //   const event = new MessageEvent(COSMIFRAME_KEYSTORECHANGE_EVENT);
  //   console.log("a", event)
  //   walletManager._handleCosmiframeKeystoreChangeEvent(event);
  //   expect(window.dispatchEvent).toBeCalledWith(new Event(COSMIFRAME_KEYSTORECHANGE_EVENT))
  // });

  it('should call onMounted function', async () => {
    jest.spyOn(walletManager, 'setEnv')
    const env = { "browser": "firefox", "device": "mobile", "os": "windows" }
    walletManager.cosmiframeEnabled = true
    walletManager.walletRepos = [{ setEnv: jest.fn() }, { setEnv: jest.fn() }, { setEnv: jest.fn() }] as any
    walletManager.mainWallets = [
      { setEnv: jest.fn(), walletInfo: { connectEventNamesOnWindow: ['event1', 'event2'] }, initClient: jest.fn() },
      { setEnv: jest.fn(), walletInfo: { connectEventNamesOnWindow: ['event1', 'event2'] }, initClient: jest.fn() },
      { setEnv: jest.fn(), walletInfo: { connectEventNamesOnWindow: ['event1', 'event2'] }, initClient: jest.fn() }] as any
    await walletManager.onMounted()
    expect(window.addEventListener).toBeCalledWith('message', walletManager._handleCosmiframeKeystoreChangeEvent)
    expect(walletManager.setEnv).toBeCalledWith(env)
    walletManager.walletRepos.forEach(wr => {
      expect(wr.setEnv).toBeCalledWith(env)
    })
  });

  it('should binding events when call onMounted function', async () => {
    const env = { "browser": "firefox", "device": "mobile", "os": "windows" }
    walletManager.mainWallets = [
      { setEnv: jest.fn(), walletInfo: { connectEventNamesOnWindow: ['event11', 'event12'] }, initClient: jest.fn() },
      { setEnv: jest.fn(), walletInfo: { connectEventNamesOnWindow: ['event21', 'event22'] }, initClient: jest.fn() },
      { setEnv: jest.fn(), walletInfo: { connectEventNamesOnWindow: ['event31', 'event32'] }, initClient: jest.fn() }] as any
    await walletManager.onMounted()
    walletManager.mainWallets.forEach(w => {
      expect(w.setEnv).toBeCalledWith(env)
    })
    expect(window.addEventListener).toBeCalledTimes(6)
  })

  it('should call onUnmounted function', () => {
    walletManager.cosmiframeEnabled = true
    walletManager.onUnmounted();
    expect(window.removeEventListener).toBeCalledWith('message', walletManager._handleCosmiframeKeystoreChangeEvent);
  });

  it('should binding events when call onUnmounted function', async () => {
    walletManager.mainWallets = [
      { setEnv: jest.fn(), walletInfo: { connectEventNamesOnWindow: ['event11', 'event12'] }, initClient: jest.fn() },
      { setEnv: jest.fn(), walletInfo: { connectEventNamesOnWindow: ['event21', 'event22'] }, initClient: jest.fn() },
      { setEnv: jest.fn(), walletInfo: { connectEventNamesOnWindow: ['event31', 'event32'] }, initClient: jest.fn() }] as any
    await walletManager.onUnmounted()

    expect(window.removeEventListener).toBeCalledTimes(6)
  })

});
