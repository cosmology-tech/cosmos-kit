import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { StargateClientOptions } from '@cosmjs/stargate';
import { ChainWalletBase, ChainRecord, Endpoints, State } from "@cosmos-kit/core";
import { mockExtensionInfo as walletInfo } from '../src/mock-extension/extension/registry';
import { chains, assets } from 'chain-registry'
import { AssetList, Chain } from "@chain-registry/types";

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
  beforeEach(() => {
    chainMock = chains.find((c) => c.chain_name === 'osmosis') as Chain;
    assetListMock = assets.find((a) => a.chain_name === 'osmosis') as AssetList;
    preferredEndpointsMock = {
      isLazy: false,
      rpc: ['http://rpc.testnet.osmosis.zone:26657'],
      rest: ['http://rest.testnet.osmosis.zone:1317']
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
    expect(chainWallet.preferredEndpoints.rpc?.length).toEqual(2);
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

    chainWallet.setData(data);
    expect(chainWallet.mutable.data).toEqual(data);
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
    expect(chainWallet.state).toBe(State.Init);
    await chainWallet.update();
    expect(chainWallet.state).toBe(State.Done);
    expect(chainWallet.data.namespace).toBe(mockData.namespace);
  });


});
