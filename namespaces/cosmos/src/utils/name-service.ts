import { ChainName } from '@cosmos-kit/core';
import { nameServiceRegistries } from '../config';
import { NameServiceName, NameServiceRegistry } from '../types/common';

export const getNameServiceRegistryFromChainName = (
  chainName: ChainName
): NameServiceRegistry => {
  const registry = nameServiceRegistries.find((r) => r.chainName === chainName);
  if (!registry) {
    throw new Error('No such name service registered with chain ' + chainName);
  }
  return registry;
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
