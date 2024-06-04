
import { AssetList, Chain } from '@chain-registry/types';
import { ChainRecord, EndpointOptions, Endpoints, State, WalletStatus } from '../../src/types';
import { mockExtensionInfo as walletInfo } from '../../test-utils/mock-extension/extension/registry';
import { StargateClientOptions } from '@cosmjs/stargate';
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { ChainMockExtension } from '../../test-utils/mock-extension/extension/chain-wallet';
import { MockExtensionWallet } from '../../test-utils/mock-extension/extension/main-wallet';
import { ChainWalletBase } from '../../src/bases';
import { COSMIFRAME_WALLET_ID } from '../../src/cosmiframe/constants';

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
  localStorage: storageMockInstance
}


describe('MainWalletBase', () => {
  let mainWallet: MockExtensionWallet;
  let chainWallet: ChainMockExtension;
  let chainRecordMock: ChainRecord;


  let chainMock: Chain;
  let assetListMock: AssetList;
  let preferredEndpointsMock: Endpoints;
  let stargateMock: StargateClientOptions = expect.any(Object);
  let signingCosmwasmMock: SigningCosmWasmClientOptions = expect.any(Object);


  beforeEach(() => {
    chainRecordMock = {
      name: 'osmosis',
      chain: chainMock,
      assetList: assetListMock,
      preferredEndpoints: preferredEndpointsMock,
      clientOptions: {
        signingStargate: undefined,
        stargate: stargateMock,
        signingCosmwasm: signingCosmwasmMock
      }
    };
    chainWallet = new ChainMockExtension(walletInfo, chainRecordMock);
    mainWallet = new MockExtensionWallet(walletInfo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize MainWalletBase', () => {
    expect(mainWallet).toBeDefined();
    expect(mainWallet.ChainWallet).toBe(ChainMockExtension);
    expect(mainWallet.emitter).toBeDefined();
    expect(mainWallet.preferredEndpoints).toBeUndefined();
  });

  it('should initialize the client when calling initingClient', () => {
    const actionsMock = {
      clientState: jest.fn(),
      clientMessage: jest.fn(),
    }
    const initingClientMock1 = jest.fn()
    const initingClientMock2 = jest.fn()

    jest.spyOn(mainWallet, 'chainWalletMap', 'get').mockReturnValue(new Map([
      ['osmosis1', { initingClient: initingClientMock1 } as any],
      ['osmosis2', { initingClient: initingClientMock2 } as any]
    ]))
    mainWallet.setActions(actionsMock)
    mainWallet.initingClient();
    expect(mainWallet.clientMutable.state).toBe(State.Pending)
    expect(mainWallet.clientMutable.message).toBeUndefined();
    expect(mainWallet.clientMutable.data).toBeUndefined();
    expect(mainWallet.actions?.clientState).toHaveBeenCalledWith(State.Pending);
    expect(mainWallet.actions?.clientMessage).toHaveBeenCalledWith(undefined);
    expect(initingClientMock1).toHaveBeenCalled();
    expect(initingClientMock2).toHaveBeenCalled();
  });

  it('should initialize the client when calling initingDone', () => {
    const actionsMock = {
      clientState: jest.fn(),
      clientMessage: jest.fn(),
    }
    const initClientDoneMock1 = jest.fn()
    const initClientDoneMock2 = jest.fn()

    jest.spyOn(mainWallet, 'chainWalletMap', 'get').mockReturnValue(new Map([
      ['osmosis1', { initClientDone: initClientDoneMock1 } as any],
      ['osmosis2', { initClientDone: initClientDoneMock2 } as any]
    ]))

    mainWallet.setActions(actionsMock)
    const walletClient = {} as any
    mainWallet.initClientDone(walletClient);
    expect(mainWallet.clientMutable.state).toBe(State.Done)
    expect(mainWallet.clientMutable.message).toBeUndefined();
    expect(mainWallet.clientMutable.data).toBe(walletClient);
    expect(mainWallet.actions?.clientState).toHaveBeenCalledWith(State.Done);
    expect(mainWallet.actions?.clientMessage).toHaveBeenCalledWith(undefined);
    expect(initClientDoneMock1).toHaveBeenCalledWith(walletClient);
    expect(initClientDoneMock2).toHaveBeenCalledWith(walletClient);
  });

  it('should initialize the client when calling initClientError', () => {
    const actionsMock = {
      clientState: jest.fn(),
      clientMessage: jest.fn(),
    }
    const initClientErrorMock1 = jest.fn()
    const initClientErrorMock2 = jest.fn()

    jest.spyOn(mainWallet, 'chainWalletMap', 'get').mockReturnValue(new Map([
      ['osmosis1', { initClientError: initClientErrorMock1 } as any],
      ['osmosis2', { initClientError: initClientErrorMock2 } as any]
    ]))

    mainWallet.setActions(actionsMock)
    const error = new Error('error when initializing client')
    mainWallet.initClientError(error);
    expect(mainWallet.clientMutable.state).toBe(State.Error)
    expect(mainWallet.clientMutable.message).toBe(error.message);
    expect(mainWallet.actions?.clientState).toBeCalledWith(State.Error);
    expect(mainWallet.actions?.clientMessage).toBeCalledWith(error.message);
    expect(initClientErrorMock1).toHaveBeenCalledWith(error);
    expect(initClientErrorMock2).toHaveBeenCalledWith(error);
  });

  it('should add endpoints to chain wallets', () => {
    const endpoints: EndpointOptions['endpoints'] = {
      'chain1': {
        rpc: ['https://rpc.chain1.com'],
        rest: ['https://rest.chain1.com'],
      },
      'chain2': {
        rpc: ['https://rpc.chain2.com'],
        rest: ['https://rest.chain2.com'],
      },
    }
    const wallet1 = { chainName: 'chain1', addEndpoints: jest.fn() }
    const wallet2 = { chainName: 'chain2', addEndpoints: jest.fn() }
    jest.spyOn(mainWallet, 'getChainWalletList').mockReturnValue([
      wallet1, wallet2
    ] as any[])
    mainWallet.addEnpoints(endpoints);
    expect(wallet1.addEndpoints).toHaveBeenCalledWith(endpoints[wallet1.chainName]);
    expect(wallet2.addEndpoints).toHaveBeenCalledWith(endpoints[wallet2.chainName]);
  });

  it('should set chains', () => {
    const chains = [
      {
        name: 'chain1',
        preferredEndpoints: {
          rpc: ['https://rpc.chain1.com'],
          rest: ['https://rest.chain1.com'],
        },
        isLazy: true
      },
      {
        name: 'chain2',
        preferredEndpoints: {
          rpc: ['https://rpc.chain2.com'],
          rest: ['https://rest.chain2.com'],
        },
      },
    ];
    mainWallet.setChains(chains);
    expect(mainWallet.chainWalletMap).toBeDefined();
    expect(mainWallet.chainWalletMap?.size).toBe(2);
    const chainWallet1 = mainWallet.getChainWallet('chain1');
    const chainWallet2 = mainWallet.getChainWallet('chain2');
    expect(chainWallet1).toBeDefined();
    expect(chainWallet2).toBeDefined();
    expect(chainWallet1?.chainName).toBe('chain1');
    expect(chainWallet2?.chainName).toBe('chain2');
    expect(chainWallet1?.preferredEndpoints).toEqual({
      rpc: ['https://rpc.chain1.com', 'https://rpc.cosmos.directory/chain1'],
      rest: ['https://rest.chain1.com', 'https://rest.cosmos.directory/chain1'],
    });
    expect(chainWallet2?.preferredEndpoints).toEqual({
      rpc: ['https://rpc.chain2.com', 'https://rpc.cosmos.directory/chain2'],
      rest: ['https://rest.chain2.com', 'https://rest.cosmos.directory/chain2'],
    });
  });


  it('should get chain wallet', () => {
    const chainWallet1: ChainWalletBase = { chainName: 'chain1' } as any;
    const chainWallet2: ChainWalletBase = { chainName: 'chain2' } as any;
    jest.spyOn(mainWallet, 'chainWalletMap', 'get').mockReturnValue(
      new Map([
        ['chain1', chainWallet1],
        ['chain2', chainWallet2],
      ])
    );

    const result1 = mainWallet.getChainWallet('chain1');
    const result2 = mainWallet.getChainWallet('chain2');
    const result3 = mainWallet.getChainWallet('chain3');

    expect(result1).toBe(chainWallet1);
    expect(result2).toBe(chainWallet2);
    expect(result3).toBeUndefined();
  });

  it('should get chain wallet list', () => {
    const chainWallet1: ChainWalletBase = { chainName: 'chain1', isActive: true } as any;
    const chainWallet2: ChainWalletBase = { chainName: 'chain2', isActive: false } as any;
    const chainWallet3: ChainWalletBase = { chainName: 'chain3', isActive: true } as any;
    chainWallet1.isActive = true;
    chainWallet2.isActive = false;
    chainWallet3.isActive = true;
    jest.spyOn(mainWallet, 'chainWalletMap', 'get').mockReturnValue(
      new Map([
        ['chain1', chainWallet1],
        ['chain2', chainWallet2],
        ['chain3', chainWallet3],
      ])
    )
    const activeChainWallets = mainWallet.getChainWalletList(true);
    const allChainWallets = mainWallet.getChainWalletList(false);
    expect(activeChainWallets).toHaveLength(2);
    expect(activeChainWallets).toContain(chainWallet1);
    expect(activeChainWallets).toContain(chainWallet3);
    expect(allChainWallets).toHaveLength(3);
    expect(allChainWallets).toContain(chainWallet1);
    expect(allChainWallets).toContain(chainWallet2);
    expect(allChainWallets).toContain(chainWallet3);
  });

  it('should get global status and message', () => {
    let status, message
    const chainWalletConnected: ChainWalletBase = { walletStatus: WalletStatus.Connected, isWalletNotExist: false, message: 'Chain 1 connected' } as any;
    const chainWalletNotExist: ChainWalletBase = { walletStatus: WalletStatus.NotExist, isWalletNotExist: true, message: 'Chain 2 not exist' } as any;
    const chainWalletConnecting: ChainWalletBase = { walletStatus: WalletStatus.Connecting, isWalletConnecting: true } as any;
    const chainWalletDisconnected: ChainWalletBase = { walletStatus: WalletStatus.Disconnected, isWalletDisconnected: true } as any;
    const chainWalletReject: ChainWalletBase = { walletStatus: WalletStatus.Rejected, isWalletRejected: true, message: 'Chain 5 rejected' } as any;
    const chainWalletError: ChainWalletBase = { walletStatus: WalletStatus.Error, isError: true, message: 'Chain 6 error' } as any;

    jest.spyOn(mainWallet, 'getChainWalletList').mockReturnValue([
      chainWalletConnected
    ]);
    [status, message] = mainWallet.getGlobalStatusAndMessage();
    expect(status).toBe(WalletStatus.Connected);
    expect(message).toBeUndefined();

    jest.spyOn(mainWallet, 'getChainWalletList').mockReturnValue([
      chainWalletConnected,
      chainWalletNotExist
    ]);
    [status, message] = mainWallet.getGlobalStatusAndMessage();
    expect(status).toBe(chainWalletNotExist.walletStatus);
    expect(message).toBe(chainWalletNotExist.message);

    jest.spyOn(mainWallet, 'getChainWalletList').mockReturnValue([
      chainWalletConnected,
      chainWalletConnecting
    ]);
    [status, message] = mainWallet.getGlobalStatusAndMessage();
    expect(status).toBe(chainWalletConnecting.walletStatus);
    expect(message).toBeUndefined();

    jest.spyOn(mainWallet, 'getChainWalletList').mockReturnValue([
      chainWalletConnected,
      chainWalletDisconnected
    ]);
    [status, message] = mainWallet.getGlobalStatusAndMessage();
    expect(status).toBe(chainWalletDisconnected.walletStatus);
    expect(message).toBe('Exist disconnected wallets')

    jest.spyOn(mainWallet, 'getChainWalletList').mockReturnValue([
      chainWalletConnected,
      chainWalletReject
    ]);
    [status, message] = mainWallet.getGlobalStatusAndMessage();
    expect(status).toBe(chainWalletReject.walletStatus);
    expect(message).toBe(chainWalletReject.message);

    jest.spyOn(mainWallet, 'getChainWalletList').mockReturnValue([
      chainWalletConnected,
      chainWalletError
    ]);
    [status, message] = mainWallet.getGlobalStatusAndMessage();
    expect(status).toBe(chainWalletError.walletStatus);
    expect(message).toBe(chainWalletError.message);

  });

  it('should update main wallet', async () => {
    jest.spyOn(mainWallet, 'setData')
    jest.spyOn(mainWallet, 'setMessage')
    jest.spyOn(mainWallet, 'setState')
    jest.spyOn(mainWallet, 'activate')
    jest.spyOn(window.localStorage, 'setItem');
    await mainWallet.update();
    expect(mainWallet.setData).toBeCalledWith(undefined);
    expect(mainWallet.setMessage).toBeCalledWith(undefined);
    expect(mainWallet.setState).toBeCalledWith('Done');
    expect(mainWallet.activate).toBeCalledWith();
    expect(window.localStorage.setItem).toBeCalledWith('cosmos-kit@2:core//current-wallet', 'mock-extension');

    jest.spyOn(mainWallet, 'walletStatus', 'get').mockReturnValue(WalletStatus.NotExist);
    jest.spyOn(window.localStorage, 'removeItem');
    await mainWallet.update();
    expect(window.localStorage.removeItem).toBeCalledWith('cosmos-kit@2:core//current-wallet');
  });

  it('should reset main wallet', () => {
    jest.spyOn(mainWallet, 'setData')
    jest.spyOn(mainWallet, 'setMessage')
    jest.spyOn(mainWallet, 'setState')
    jest.spyOn(mainWallet, 'inactivate')
    mainWallet.reset();
    expect(mainWallet.setData).toBeCalledWith(undefined);
    expect(mainWallet.setMessage).toBeCalledWith(undefined);
    expect(mainWallet.setState).toBeCalledWith('Init');
    expect(mainWallet.inactivate).toBeCalled();
  });

  it('should connect all chain wallets', async () => {
    const mobileChainWallet1: ChainWalletBase = { isModeWalletConnect: true, connectChains: () => { } } as any;
    const mobileChainWallet2: ChainWalletBase = { isModeWalletConnect: true, connectChains: () => { } } as any;

    const chainWallet1: ChainWalletBase = { chainName: 'chain1', connect: jest.fn() } as any;
    const chainWallet2: ChainWalletBase = { chainName: 'chain1', connect: jest.fn() } as any;
    const chainWalletExclude: ChainWalletBase = { chainName: 'excludeChainName', connect: jest.fn() } as any;

    jest.spyOn(mainWallet, 'getChainWalletList').mockReturnValue([
      mobileChainWallet1, mobileChainWallet2
    ])

    expect(await mainWallet.connectAll()).toBeUndefined()

    jest.spyOn(mainWallet, 'getChainWalletList').mockReturnValue([
      chainWallet1, chainWallet2, chainWalletExclude
    ])
    await mainWallet.connectAll(true, 'excludeChainName')
    expect(chainWallet1.connect).toBeCalled()
    expect(chainWallet2.connect).toBeCalled()
    expect(chainWalletExclude.connect).not.toBeCalled()
  });


  it('should disconnect all chain wallets', async () => {
    const chainWallet1: ChainWalletBase = { chainName: 'chain1', disconnect: jest.fn() } as any;
    const chainWallet2: ChainWalletBase = { chainName: 'chain2', disconnect: jest.fn() } as any;
    const chainWallet3: ChainWalletBase = { chainName: 'excludeChainName', disconnect: jest.fn() } as any;

    jest.spyOn(mainWallet, 'getChainWalletList').mockReturnValue([
      chainWallet1, chainWallet2, chainWallet3
    ])
    const disconnectOption = { walletconnect: { removeAllPairings: true } }
    await mainWallet.disconnectAll(true, 'excludeChainName', disconnectOption);
    expect(chainWallet1.disconnect).toBeCalledWith(false, disconnectOption);
    expect(chainWallet1.disconnect).toBeCalledWith(false, disconnectOption);
    expect(chainWallet3.disconnect).not.toBeCalled();
  });

});
