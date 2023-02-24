import { Logger as TsLogger } from 'ts-log';
import { LogLevel } from '../types';
export declare class Logger implements TsLogger {
    private readonly logger;
    readonly level: LogLevel;
    readonly levelOrder: LogLevel[];
    constructor(logger?: TsLogger, level?: LogLevel);
    private compare;
    trace(message?: any, ...optionalParams: any[]): void;
    debug(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
}
