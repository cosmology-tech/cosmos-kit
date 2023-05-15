import { ExtendedHttpEndpoint } from '../types';
import { Logger } from './logger';
declare type NodeType = 'rest' | 'rpc';
export declare const getFastestEndpoint: (endpoints: (string | ExtendedHttpEndpoint)[], nodeType: NodeType, logger?: Logger) => Promise<string | ExtendedHttpEndpoint>;
export declare const isValidEndpoint: (endpoint: string | ExtendedHttpEndpoint, nodeType: NodeType, isLazy?: boolean, logger?: Logger) => Promise<boolean>;
export declare const getIsLazy: (globalIsLazy?: boolean, chainIsLazy?: boolean, endpointIsLazy?: boolean, parameterIsLazy?: boolean, logger?: Logger) => boolean;
export {};
