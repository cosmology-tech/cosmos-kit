import {
  getNameServiceRegistryFromChainName,
  getNameServiceRegistryFromName,
  getNameServiceNameFromChainName,
  getChainNameFromNameServiceName,
} from '../../src/utils'; // Replace 'yourFile' with the actual path to your file
import { nameServiceRegistries } from '../../src/config'; // Assuming 'nameServiceRegistries' contains real data

describe('Name Service Utility Functions Tests', () => {
  test.each(nameServiceRegistries)(
    'getNameServiceRegistryFromChainName should return the correct registry for chain %p',
    (chain) => {
      const registry = getNameServiceRegistryFromChainName(chain.chainName);
      expect(registry).toEqual(chain);
      expect(registry.getQueryMsg('address')).toEqual(chain.getQueryMsg('address'));
    }
  );

  test.each(nameServiceRegistries)(
    'getNameServiceRegistryFromName should return the correct registry for name %p',
    (chain) => {
      const registry = getNameServiceRegistryFromName(chain.name);
      expect(registry).toEqual(chain);
    }
  );

  test.each(nameServiceRegistries)(
    'getNameServiceNameFromChainName should return the correct name for chain %p',
    (chain) => {
      const name = getNameServiceNameFromChainName(chain.chainName);
      expect(name).toBe(chain.name);
    }
  );

  test.each(nameServiceRegistries)(
    'getChainNameFromNameServiceName should return the correct chain name for name %p',
    (chain) => {
      const chainName = getChainNameFromNameServiceName(chain.name);
      expect(chainName).toBe(chain.chainName);
    }
  );

  test('getNameServiceRegistryFromChainName should throw an error if no registry found', () => {
    const nonExistentChainName = 'nonExistentChain';
    expect(() => getNameServiceRegistryFromChainName(nonExistentChainName)).toThrowError(
      `No such name service registered with chain ${nonExistentChainName}`
    );
  });

  test('getNameServiceNameFromChainName should return undefined for non-existent chain', () => {
    const nonExistentChainName = 'nonExistentChain';
    const result = getNameServiceNameFromChainName(nonExistentChainName);
    expect(result).toBeUndefined();
  });

  test('getChainNameFromNameServiceName should return undefined for non-existent name service', () => {
    const nonExistentNameService = 'nonExistentNameService';
    const result = getChainNameFromNameServiceName(nonExistentNameService);
    expect(result).toBeUndefined();
  });
});
