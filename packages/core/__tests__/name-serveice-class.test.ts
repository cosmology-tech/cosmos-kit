import type { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { NameServiceRegistry } from '../src/types';
import { NameService } from '../src/name-service';


describe('NameService', () => {
  const mockClient: CosmWasmClient = {} as CosmWasmClient;
  const mockRegistry: NameServiceRegistry = {} as NameServiceRegistry;

  it('Instantiates correctly', () => {
    const nameService = new NameService(mockClient, mockRegistry);
    expect(nameService.client).toEqual(mockClient);
    expect(nameService.registry).toEqual(mockRegistry);
  });

  it('Resolves a name for a given address', async () => {
    const mockAddress = 'cosmos1abcdefg';
    const mockResult = { name: 'Alice' };

    mockRegistry.contract = 'registryContract';
    mockRegistry.getQueryMsg = jest.fn().mockReturnValue('queryMsg');

    mockClient.queryContractSmart = jest.fn().mockResolvedValue(mockResult);

    const nameService = new NameService(mockClient, mockRegistry);
    const result = await nameService.resolveName(mockAddress);

    expect(mockRegistry.getQueryMsg).toHaveBeenCalledWith(mockAddress);
    expect(mockClient.queryContractSmart).toHaveBeenCalledWith(
      mockRegistry.contract,
      'queryMsg'
    );
    expect(result).toEqual(mockResult);
  });

  it('Returns undefined if an error occurs during name resolution', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockAddress = 'cosmos1abcdefg';

    mockRegistry.contract = 'registryContract';
    mockRegistry.getQueryMsg = jest.fn().mockReturnValue('queryMsg');

    mockClient.queryContractSmart = jest.fn().mockRejectedValue(new Error('Query failed'));

    const nameService = new NameService(mockClient, mockRegistry);
    const result = await nameService.resolveName(mockAddress);

    expect(mockRegistry.getQueryMsg).toHaveBeenCalledWith(mockAddress);
    expect(mockClient.queryContractSmart).toHaveBeenCalledWith(
      mockRegistry.contract,
      'queryMsg'
    );
    expect(result).toBeUndefined();
  });
});
