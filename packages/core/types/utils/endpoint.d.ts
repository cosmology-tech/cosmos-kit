import { ExtendedHttpEndpoint } from '../types';
import { Logger } from './logger';
export declare const getFastestEndpoint: (endpoints: (string | ExtendedHttpEndpoint)[], logger?: Logger) => Promise<string | ExtendedHttpEndpoint>;
export declare const isValidEndpoint: (endpoint: string | ExtendedHttpEndpoint, isLazy?: boolean, logger?: Logger) => Promise<boolean>;
export declare const getIsLazy: (globalIsLazy?: boolean, chainIsLazy?: boolean, endpointIsLazy?: boolean, parameterIsLazy?: boolean, logger?: Logger) => boolean;
