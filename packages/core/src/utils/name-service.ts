import { nameServiceRegistries } from '../config';
import { ChainName, NameServiceName, NameServiceRegistry } from '../types';

export const getNameServiceRegistryFromChainName = (
  chainName: ChainName
): NameServiceRegistry | undefined => {
  return nameServiceRegistries.find((r) => r.chainName === chainName);
};

export const getNameServiceRegistryFromName = (
  name: NameServiceName
): NameServiceRegistry | undefined => {
  return nameServiceRegistries.find((r) => r.name === name);
};

export const getNameServiceNameFromChainName = (
  chainName: ChainName
): NameServiceName | undefined => {
  return nameServiceRegistries.find((r) => r.chainName === chainName)?.name;
};

export const getChainNameFromNameServiceName = (
  name: NameServiceName
): ChainName | undefined => {
  return nameServiceRegistries.find((r) => r.name === name)?.chainName;
};
