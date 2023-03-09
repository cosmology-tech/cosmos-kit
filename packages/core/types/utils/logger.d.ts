import { LogLevel } from '../types';
export declare class Logger {
    private readonly logger;
    readonly level: LogLevel;
    readonly levelOrder: LogLevel[];
    constructor(level?: LogLevel);
    private compare;
    trace(message?: any, ...optionalParams: any[]): void;
    debug(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
    error(message?: any, ...optionalParams: any[]): void;
}
