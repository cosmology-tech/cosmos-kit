import { HttpEndpoint } from '@cosmjs/cosmwasm-stargate';
import { Logger } from './logger';
export declare const isValidEndpoint: (endpoint: string | HttpEndpoint, logger?: Logger) => Promise<boolean>;
