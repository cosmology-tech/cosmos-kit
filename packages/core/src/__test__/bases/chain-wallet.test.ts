import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { StargateClientOptions } from '@cosmjs/stargate';
import { mockExtensionInfo as walletInfo } from '../mock-extension/extension/registry';
import { chains, assets } from 'chain-registry'
import { AssetList, Chain } from "@chain-registry/types";
import { ChainWalletBase } from '../../bases';
import { ChainRecord, Endpoints, State } from '../../types';
import nock from 'nock'

const stargateClientConnectMock = jest.fn()
jest.mock('@cosmjs/stargate', () => {
  return {
    StargateClient: {
      connect: stargateClientConnectMock
    }
  }
})
const cosmwasmClientConnectMock = jest.fn()
jest.mock('@cosmjs/cosmwasm-stargate', () => {
  return {
    CosmWasmClient: {
      connect: cosmwasmClientConnectMock
    }
  }
})

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

describe('ChainWalletBase', () => {
  let chainWallet: ChainWalletBase;
  let chainMock: Chain;
  let assetListMock: AssetList;
  let preferredEndpointsMock: Endpoints;
  let chainRecordMock: ChainRecord;
  let stargateMock: StargateClientOptions = expect.any(Object);
  let signingCosmwasmMock: SigningCosmWasmClientOptions = expect.any(Object);

  const slowRpcURL = 'http://fake-rpc-endpoint.slow'
  const fastRpcURL = 'http://fake-rpc-endpoint.fast'
  const slowRestURL = 'http://fake-rest-endpoint.slow'
  const fastRestURL = 'http://fake-rest-endpoint.fast'

  beforeEach(() => {
    nock(slowRestURL).get('/cosmos/base/tendermint/v1beta1/node_info').delayConnection(5).reply(200, 'ok')
    nock(fastRestURL).get('/cosmos/base/tendermint/v1beta1/node_info').reply(200, 'ok')
    nock(slowRpcURL).post('/').delayConnection(5).reply(200, 'ok')
    nock(fastRpcURL).post('/').reply(200, 'ok')
  })

  afterAll(() => {
    nock.restore()
  })

  beforeEach(() => {
    chainMock = chains.find((c) => c.chain_name === 'osmosis') as Chain;
    assetListMock = assets.find((a) => a.chain_name === 'osmosis') as AssetList;
    preferredEndpointsMock = {
      isLazy: false,
      rpc: [slowRpcURL, fastRpcURL],
      rest: [slowRestURL, fastRestURL]
    }
    chainRecordMock = {
      name: 'osmosis-testnet',
      chain: chainMock,
      assetList: assetListMock,
      preferredEndpoints: preferredEndpointsMock,
      clientOptions: {
        signingStargate: undefined,
        stargate: stargateMock,
        signingCosmwasm: signingCosmwasmMock
      }
    };
    chainWallet = new ChainWalletBase(walletInfo, chainRecordMock);
  });

  afterEach(() => {
    storageMockInstance.removeItem('cosmos-kit@2:core//accounts');
  })

  it('should have the correct assets', () => {
    expect(chainWallet.assets).toBe(assetListMock.assets);
  });

  it('should have the correct isTestNet', () => {
    expect(chainWallet.isTestNet).toBeTruthy();
  })

  it('should have the correct preferred endpoints', () => {
    expect(chainWallet.preferredEndpoints).toBe(preferredEndpointsMock);
  })

  it('should get right rpc endpoint', () => {
    expect(chainWallet.rpcEndpoints).toBe(preferredEndpointsMock.rpc);
  })

  it('should get right rest endpoint', () => {
    expect(chainWallet.restEndpoints).toBe(preferredEndpointsMock.rest);
  })

  it('should get right isLazy', () => {
    expect(chainWallet.isLazy).toBe(preferredEndpointsMock.isLazy);
  })

  it('should have the correct addEndpoints function', () => {
    const newEndpoints = {
      isLazy: true,
      rpc: ['http://rpc.testnet.osmosis.zone:26657'],
    }
    chainWallet.addEndpoints(newEndpoints);
    expect(chainWallet.preferredEndpoints.rpc?.length).toEqual(3);
  })

  it('should have the correct chain name', () => {
    expect(chainWallet.chainName).toBe(chainRecordMock.name);
  })

  it('should have the correct chain logo URL', () => {
    expect(chainWallet.chainLogoUrl).toBe(assetListMock.assets[0]?.logo_URIs?.svg || assetListMock.assets[0].logo_URIs?.png || undefined);
  });

  it('should have the correct chain ID', () => {
    expect(chainWallet.chainId).toBe(chainMock.chain_id);
  });

  it('should have the stargateOptions', () => {
    expect(chainWallet.stargateOptions).toEqual(chainRecordMock.clientOptions?.stargate);
  })

  it('should have the correct signing options', () => {
    expect(chainWallet.signingStargateOptions).toEqual(chainRecordMock.clientOptions?.stargate)
  });

  it('should have the correct signing cosmwasm options', () => {
    expect(chainWallet.signingCosmwasmOptions).toEqual(chainRecordMock.clientOptions?.signingCosmwasm);
  })

  it('should have the correct assets', () => {
    expect(chainWallet.assets).toEqual(assetListMock.assets);
  })

  it('should have the correct chainId', () => {
    expect(chainWallet.chainId).toBe(chainMock.chain_id);
  })

  it('should have cosmwasm enabled', () => {
    expect(chainWallet.cosmwasmEnabled).toBe(chainMock.codebase?.cosmwasm_enabled);
  });

  it('should have the correct address', () => {
    const mockData = {
      namespace: 'cosmos',
      chainId: 'cosmoshub-4',
      address: 'cosmos1...'
    };
    chainWallet.setData(mockData)
    expect(chainWallet.address).toBe(mockData.address);
  })

  it('should have the correct namespace', () => {
    const mockData = {
      namespace: 'cosmos',
      chainId: 'cosmoshub-4',
      address: 'cosmos1...'
    };
    chainWallet.setData(mockData)
    expect(chainWallet.namespace).toBe(mockData.namespace);
  })

  it('should set Data correctly', () => {
    const data = {
      namespace: 'cosmos',
      chainId: 'cosmoshub-4',
      address: 'cosmos1...'
    };

    const localStorageSetItemMock = jest.spyOn(window.localStorage, 'setItem');
    chainWallet.setData(data);
    expect(chainWallet.mutable.data).toEqual(data);
    expect(localStorageSetItemMock).toHaveBeenCalled()
    expect(window.localStorage.getItem('cosmos-kit@2:core//accounts')).toEqual(JSON.stringify([data]));
  })

  it('should throw an error when calling initClient', () => {
    expect(() => chainWallet.initClient()).toThrow('initClient not implemented');
  });

  it('should update state and data correctly', async () => {
    const mockData = {
      namespace: 'cosmos',
      chainId: 'cosmoshub-4',
      address: 'cosmos1...'
    };
    jest.spyOn(chainWallet, 'client', 'get').mockReturnValue({
      getSimpleAccount: jest.fn().mockResolvedValue(mockData),
    });
    const setStateMock = jest.spyOn(chainWallet, 'setState')
    await chainWallet.update();

    expect(setStateMock.mock.calls[0][0]).toBe(State.Pending);
    expect(setStateMock.mock.calls[1][0]).toBe(State.Done);
    expect(chainWallet.data.namespace).toBe(mockData.namespace);
  });

  it('should set error state when update failed', async () => {
    const errorMessageFromWalletInfo = (walletInfo.rejectMessage as { source: string }).source
    const mockError = new Error(errorMessageFromWalletInfo);
    jest.spyOn(chainWallet, 'client', 'get').mockReturnValue({
      getSimpleAccount: jest.fn().mockRejectedValue(mockError),
    })
    expect(chainWallet.state).toBe(State.Init);
    await chainWallet.update();
    expect(chainWallet.state).toBe(State.Error);
    expect(chainWallet.rejectMessageSource).toBe(errorMessageFromWalletInfo);
    expect(chainWallet.rejectMatched(mockError)).toBeTruthy()
  });

  it('should call connectChains when update passing connect: true', () => {
    const connectChainsMockFn = jest.fn()
    chainWallet.connectChains = connectChainsMockFn;
    chainWallet.update({ connect: true });
    expect(connectChainsMockFn).toHaveBeenCalled()
  })

  it('should get rpc endpoint', async () => {
    expect(await chainWallet.getRpcEndpoint(true)).toBe(slowRpcURL);
  })

  it('should get rest endpoint', async () => {
    expect(await chainWallet.getRestEndpoint(true)).toBe(slowRestURL);
  })

  it('should get fastest rpc endpoint', async () => {
    expect(await chainWallet.getRpcEndpoint()).toBe(fastRpcURL);
  })

  it('should get fastest rest endpoint', async () => {
    expect(await chainWallet.getRestEndpoint()).toBe(fastRestURL);
  })

  it('should call getStargateClient correctly', async () => {
    await chainWallet.getStargateClient()
    expect(stargateClientConnectMock).toHaveBeenCalledWith(fastRpcURL, stargateMock)
  })

  it('should call getCosmWasmClient correctly', async () => {
    await chainWallet.getCosmWasmClient()
    expect(cosmwasmClientConnectMock).toHaveBeenCalledWith(fastRpcURL)
  })

});
