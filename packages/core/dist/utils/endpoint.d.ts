import { E as ExtendedHttpEndpoint } from '../chain-932d9904.js';
import { Logger } from './logger.js';
import '@chain-registry/types';
import '@cosmjs/cosmwasm-stargate';
import '@cosmjs/stargate';
import '../types/common.js';
import '@cosmjs/amino';
import '@cosmjs/proto-signing';
import '@walletconnect/types';
import 'cosmjs-types/cosmos/tx/v1beta1/tx';
import 'events';

declare type NodeType = 'rest' | 'rpc';
declare const getFastestEndpoint: (endpoints: (string | ExtendedHttpEndpoint)[], nodeType: NodeType, logger?: Logger) => Promise<string | ExtendedHttpEndpoint>;
declare const isValidEndpoint: (endpoint: string | ExtendedHttpEndpoint, nodeType: NodeType, isLazy?: boolean, logger?: Logger) => Promise<boolean>;
declare const getIsLazy: (globalIsLazy?: boolean, chainIsLazy?: boolean, endpointIsLazy?: boolean, parameterIsLazy?: boolean, logger?: Logger) => boolean;

export { getFastestEndpoint, getIsLazy, isValidEndpoint };
