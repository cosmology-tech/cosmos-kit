import { a as ChainName, z as NameServiceRegistry, N as NameServiceName } from '../chain-932d9904.js';
import '@chain-registry/types';
import '@cosmjs/cosmwasm-stargate';
import '@cosmjs/stargate';
import '../types/common.js';
import '@cosmjs/amino';
import '@cosmjs/proto-signing';
import '@walletconnect/types';
import 'cosmjs-types/cosmos/tx/v1beta1/tx';
import './logger.js';
import 'events';

declare const getNameServiceRegistryFromChainName: (chainName: ChainName) => NameServiceRegistry;
declare const getNameServiceRegistryFromName: (name: NameServiceName) => NameServiceRegistry | undefined;
declare const getNameServiceNameFromChainName: (chainName: ChainName) => NameServiceName | undefined;
declare const getChainNameFromNameServiceName: (name: NameServiceName) => ChainName | undefined;

export { getChainNameFromNameServiceName, getNameServiceNameFromChainName, getNameServiceRegistryFromChainName, getNameServiceRegistryFromName };
