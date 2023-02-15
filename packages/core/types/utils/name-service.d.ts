import { ChainName, NameServiceName, NameServiceRegistry } from '../types';
export declare const getNameServiceRegistryFromChainName: (chainName: ChainName) => NameServiceRegistry;
export declare const getNameServiceRegistryFromName: (name: NameServiceName) => NameServiceRegistry | undefined;
export declare const getNameServiceNameFromChainName: (chainName: ChainName) => NameServiceName | undefined;
export declare const getChainNameFromNameServiceName: (name: NameServiceName) => ChainName | undefined;
