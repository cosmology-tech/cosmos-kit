import { ChainWalletBase } from '../src/bases';
import { WalletRepo } from '../src/repository';
import { ChainRecord, DappEnv } from '../src/types';
import { chains, assets } from 'chain-registry';
import { StargateClient } from '@cosmjs/stargate';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { NameService } from '../src/name-service';

describe('WalletRepo', () => {
  let walletRepo: WalletRepo;
  let chainRecord: ChainRecord;
  let wallets: ChainWalletBase[]
  beforeEach(() => {
    // Create a new instance of WalletRepo before each test
    chainRecord = {
      name: 'test-chain',
      chain: chains.find(c => c.chain_name === 'osmosis'),
      assetList: assets.find(a => a.chain_name === 'osmosis')
    }
    wallets = [
      {
        walletName: 'test-wallet-1',
        updateCallbacks: jest.fn(),
        walletInfo: { mobileDisabled: true }
      } as any,
      {
        walletName: 'test-wallet-2',
        updateCallbacks: jest.fn(),
        walletInfo: { mobileDisabled: true }
      } as any,
      {
        walletName: 'test-wallet-mobile1',
        updateCallbacks: jest.fn(),
        walletInfo: { mobileDisabled: false }
      } as any,
      {
        walletName: 'test-wallet-mobile2',
        updateCallbacks: jest.fn(),
        walletInfo: { mobileDisabled: () => false }
      }
    ]
    walletRepo = new WalletRepo(chainRecord, wallets);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should initialize with default values', () => {
    expect(walletRepo.isActive).toBe(false);
    expect(walletRepo.chainRecord).toEqual(chainRecord);
    expect(walletRepo.namespace).toBe('cosmos');
    expect(walletRepo.repelWallet).toBe(true);
    expect(walletRepo.fetchInfo).toBe(false);
  });

  it('should set environment', () => {
    const wallets = Array.from({ length: 3 }).map(() => {
      return { setEnv: jest.fn() } as unknown as ChainWalletBase;
    })
    jest.spyOn(walletRepo, 'wallets', 'get').mockReturnValue(wallets);
    const env: DappEnv = {
      device: 'desktop',
      os: 'windows',
      browser: 'chrome',
    };

    walletRepo.setEnv(env);
    expect(walletRepo.env).toEqual(env);
    walletRepo.wallets.forEach((wallet) => {
      expect(wallet.setEnv).toBeCalledWith(env);
    });
  });

  it('should activate', () => {
    const wallets = Array.from({ length: 3 }).map(() => {
      return { activate: jest.fn() } as unknown as ChainWalletBase;
    })
    jest.spyOn(walletRepo, 'wallets', 'get').mockReturnValue(wallets);
    walletRepo.activate();
    expect(walletRepo.isActive).toEqual(true);
    walletRepo.wallets.forEach((wallet) => {
      expect(wallet.activate).toBeCalledWith();
    });
  })

  it('should get chain name', () => {
    const chainName = walletRepo.chainName;
    expect(chainName).toBe('test-chain');
  });

  it('should get chain logo', () => {
    const chainLogo = walletRepo.chainLogo;
    const uri = chainRecord.assetList?.assets[0]?.logo_URIs?.svg || chainRecord.assetList?.assets[0]?.logo_URIs?.png || undefined;
    expect(chainLogo).toBe(uri)
  });

  it('should get wallets', () => {
    expect(walletRepo.wallets).toEqual(wallets);
  });

  it('should get platform enabled wallets', () => {
    expect(walletRepo.platformEnabledWallets).toBe(wallets);

    jest.spyOn(walletRepo, 'isMobile', 'get').mockReturnValue(true);

    expect(walletRepo.platformEnabledWallets).toHaveLength(2)

  });

  it('should check if it is a single wallet', () => {
    expect(walletRepo.isSingleWallet).toBe(false);
    const multipleWallets = [
      {
        walletName: 'test-wallet-1',
      } as any
    ];
    jest.spyOn(walletRepo, 'wallets', 'get').mockReturnValue(multipleWallets);
    expect(walletRepo.isSingleWallet).toBe(true);
  });

  it('should get current wallet', async () => {
    const currentWallet = {
      walletName: 'test-wallet-1',
    } as any;
    jest.spyOn(walletRepo, 'wallets', 'get').mockReturnValue([currentWallet]);
    expect(walletRepo.current).toBe(currentWallet);


    walletRepo.logger = { warn: jest.fn() } as any
    walletRepo.repelWallet = false;
    expect(walletRepo.current).toBeUndefined();
  });

  it('should get wallet by name', () => {
    expect(walletRepo.getWallet('test-wallet-1')).toBe(wallets[0]);
    expect(walletRepo.getWallet('non-existent-wallet')).toBeUndefined();
  });

  it('should open view', () => {
    const actions = {
      viewWalletRepo: jest.fn(),
      viewOpen: jest.fn(),
    };
    walletRepo.actions = actions;
    walletRepo.openView();
    expect(actions.viewWalletRepo).toHaveBeenCalledWith(walletRepo);
    expect(actions.viewOpen).toHaveBeenCalledWith(true);
  });

  it('should close view', () => {
    const actions = {
      viewOpen: jest.fn(),
    };
    walletRepo.actions = actions;
    walletRepo.closeView();
    expect(actions.viewOpen).toHaveBeenCalledWith(false);
  });

  it('should connect wallet', async () => {
    const wallet = { connect: jest.fn() };
    walletRepo.getWallet = jest.fn().mockReturnValue(wallet);
    jest.spyOn(walletRepo, 'openView');
    await walletRepo.connect('test-wallet-1');
    expect(wallet.connect).toHaveBeenCalledWith(true);

    await walletRepo.connect();
    expect(walletRepo.openView).toHaveBeenCalled();
  });

  it('should disconnect wallet', async () => {
    const options = {
      walletconnect: {
        removeAllPairings: true
      }
    }

    const walletToGet = { disconnect: jest.fn() };
    const currentWallet = { disconnect: jest.fn() }
    jest.spyOn(walletRepo, 'getWallet').mockReturnValue(walletToGet as any);
    jest.spyOn(walletRepo, 'current', 'get').mockReturnValue(currentWallet as any);

    await walletRepo.disconnect('test-wallet-1', true, options);
    expect(walletToGet.disconnect).toHaveBeenCalledWith(true, options);

    await walletRepo.disconnect();
    expect(currentWallet.disconnect).toHaveBeenCalledWith(true, undefined)
  });

  it('should get RPC endpoint', async () => {
    const wallet1 = { getRpcEndpoint: jest.fn().mockRejectedValue('error1') };
    const wallet2 = { getRpcEndpoint: jest.fn().mockResolvedValue('endpoint') };
    jest.spyOn(walletRepo, 'wallets', 'get').mockReturnValue([wallet1, wallet2] as any);
    const result = await walletRepo.getRpcEndpoint();
    expect(result).toBe('endpoint');
    expect(wallet1.getRpcEndpoint).toHaveBeenCalled();
    expect(wallet2.getRpcEndpoint).toHaveBeenCalled();

    const walletRpcEndpointError1 = { getRpcEndpoint: jest.fn().mockRejectedValue('error1') };
    const walletRpcEndpointError2 = { getRpcEndpoint: jest.fn().mockRejectedValue('error2') };
    jest.spyOn(walletRepo, 'wallets', 'get').mockReturnValue([walletRpcEndpointError1, walletRpcEndpointError2] as any);
    await expect(walletRepo.getRpcEndpoint()).rejects.toEqual(`No valid RPC endpoint for chain ${walletRepo.chainName}!`);
    expect(walletRpcEndpointError1.getRpcEndpoint).toHaveBeenCalled();
    expect(walletRpcEndpointError2.getRpcEndpoint).toHaveBeenCalled();
  });

  it('should get REST endpoint', async () => {
    const wallet1 = { getRestEndpoint: jest.fn().mockRejectedValue('error1') };
    const wallet2 = { getRestEndpoint: jest.fn().mockResolvedValue('endpoint') };
    jest.spyOn(walletRepo, 'wallets', 'get').mockReturnValue([wallet1, wallet2] as any);
    const result = await walletRepo.getRestEndpoint();
    expect(result).toBe('endpoint');
    expect(wallet1.getRestEndpoint).toHaveBeenCalled();
    expect(wallet2.getRestEndpoint).toHaveBeenCalled();

    const walletRestEndpointError1 = { getRestEndpoint: jest.fn().mockRejectedValue('error1') };
    const walletRestEndpointError2 = { getRestEndpoint: jest.fn().mockRejectedValue('error2') };
    jest.spyOn(walletRepo, 'wallets', 'get').mockReturnValue([walletRestEndpointError1, walletRestEndpointError2] as any);
    await expect(walletRepo.getRestEndpoint()).rejects.toEqual(`No valid REST endpoint for chain ${walletRepo.chainName}!`);
    expect(walletRestEndpointError1.getRestEndpoint).toHaveBeenCalled();
    expect(walletRestEndpointError2.getRestEndpoint).toHaveBeenCalled();
  });

  it('should get Stargate client', async () => {
    const walletStargate1: StargateClient = { chainId: 'stargate1' } as any
    const walletStargate2: StargateClient = { chainId: 'stargate2' } as any
    const wallet1 = { getStargateClient: jest.fn().mockRejectedValue(walletStargate1) };
    const wallet2 = { getStargateClient: jest.fn().mockResolvedValue(walletStargate2) };
    jest.spyOn(walletRepo, 'wallets', 'get').mockReturnValue([wallet1, wallet2] as any);
    const result = await walletRepo.getStargateClient();
    expect(result).toBe(walletStargate2);
    expect(wallet1.getStargateClient).toHaveBeenCalled();
    expect(wallet2.getStargateClient).toHaveBeenCalled();

    const walletStargateClientError1 = { getStargateClient: jest.fn().mockRejectedValue('error1') };
    const walletStargateClientError2 = { getStargateClient: jest.fn().mockRejectedValue('error2') };
    jest.spyOn(walletRepo, 'wallets', 'get').mockReturnValue([walletStargateClientError1, walletStargateClientError2] as any);
    await expect(walletRepo.getStargateClient()).rejects.toEqual(`Something wrong! Probably no valid RPC endpoint for chain ${walletRepo.chainName}.`);
    expect(walletStargateClientError1.getStargateClient).toHaveBeenCalled();
    expect(walletStargateClientError2.getStargateClient).toHaveBeenCalled();
  });

  it('should get CosmWasm client', async () => {
    const walletCosmWasm1: CosmWasmClient = { chainId: 'cosmwasm1' } as any;
    const walletCosmWasm2: CosmWasmClient = { chainId: 'cosmwasm2' } as any;
    const wallet1 = { getCosmWasmClient: jest.fn().mockRejectedValue(walletCosmWasm1) };
    const wallet2 = { getCosmWasmClient: jest.fn().mockResolvedValue(walletCosmWasm2) };
    jest.spyOn(walletRepo, 'wallets', 'get').mockReturnValue([wallet1, wallet2] as any);
    const result = await walletRepo.getCosmWasmClient();
    expect(result).toBe(walletCosmWasm2);
    expect(wallet1.getCosmWasmClient).toHaveBeenCalled();
    expect(wallet2.getCosmWasmClient).toHaveBeenCalled();

    const walletCosmWasmClientError1 = { getCosmWasmClient: jest.fn().mockRejectedValue('error1') };
    const walletCosmWasmClientError2 = { getCosmWasmClient: jest.fn().mockRejectedValue('error2') };
    jest.spyOn(walletRepo, 'wallets', 'get').mockReturnValue([walletCosmWasmClientError1, walletCosmWasmClientError2] as any);
    await expect(walletRepo.getCosmWasmClient()).rejects.toEqual(`Something wrong! Probably no valid RPC endpoint for chain ${walletRepo.chainName}.`);
    expect(walletCosmWasmClientError1.getCosmWasmClient).toHaveBeenCalled();
    expect(walletCosmWasmClientError2.getCosmWasmClient).toHaveBeenCalled();
  });

  it('should get NameService', async () => {
    const walletNameService1: NameService = {
      client: { chainId: 'nameservice1' },
      registry: { name: 'icns1' }
    } as any;
    const walletNameService2: NameService = {
      client: { chainId: 'nameservice2' },
      registry: { name: 'icns2' }
    } as any;
    const wallet1 = { getNameService: jest.fn().mockRejectedValue(walletNameService1) };
    const wallet2 = { getNameService: jest.fn().mockResolvedValue(walletNameService2) };
    jest.spyOn(walletRepo, 'wallets', 'get').mockReturnValue([wallet1, wallet2] as any);
    const result = await walletRepo.getNameService();
    expect(result).toBe(walletNameService2);
    expect(wallet1.getNameService).toHaveBeenCalled();
    expect(wallet2.getNameService).toHaveBeenCalled();
    const walletNameServiceError1 = { getNameService: jest.fn().mockRejectedValue('error1') };
    const walletNameServiceError2 = { getNameService: jest.fn().mockRejectedValue('error2') };
    jest.spyOn(walletRepo, 'wallets', 'get').mockReturnValue([walletNameServiceError1, walletNameServiceError2] as any);
    await expect(walletRepo.getNameService()).rejects.toEqual(`Something wrong! Probably no valid RPC endpoint or name service is not registered for chain ${walletRepo.chainName}.`);
    expect(walletNameServiceError1.getNameService).toHaveBeenCalled();
    expect(walletNameServiceError2.getNameService).toHaveBeenCalled();
  });

});
