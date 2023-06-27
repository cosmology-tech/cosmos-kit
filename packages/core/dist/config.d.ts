import { z as NameServiceRegistry } from './chain-932d9904.js';
import '@chain-registry/types';
import '@cosmjs/cosmwasm-stargate';
import '@cosmjs/stargate';
import './types/common.js';
import '@cosmjs/amino';
import '@cosmjs/proto-signing';
import '@walletconnect/types';
import 'cosmjs-types/cosmos/tx/v1beta1/tx';
import './utils/logger.js';
import 'events';

declare const nameServiceRegistries: NameServiceRegistry[];

export { nameServiceRegistries };
