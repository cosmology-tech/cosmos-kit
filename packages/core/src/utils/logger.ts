import { dummyLogger, Logger as TsLogger } from 'ts-log';
import { LogLevel } from '../types';

function wrap(logLevel: LogLevel, message?: any) {
  if (typeof message === 'string') {
    return [`${logLevel} - ${message}`];
  } else {
    return [`${logLevel} -`, message];
  }
}

export class Logger implements TsLogger {
  private readonly logger: TsLogger;
  public readonly level: LogLevel;
  public readonly levelOrder: LogLevel[] = [
    'TRACE',
    'DEBUG',
    'INFO',
    'WARN',
    'ERROR',
  ];

  public constructor(logger: TsLogger = dummyLogger, level: LogLevel = 'INFO') {
    this.logger = logger;
    this.level = level;
  }

  private compare(a: LogLevel, b: LogLevel) {
    const aindex = this.levelOrder.indexOf(a);
    const bindex = this.levelOrder.indexOf(b);
    if (aindex > bindex) {
      return 1;
    } else if (aindex < bindex) {
      return -1;
    } else {
      return 0;
    }
  }

  public trace(message?: any, ...optionalParams: any[]): void {
    if (this.compare('TRACE', this.level) >= 0) {
      this.logger.trace(...wrap('TRACE', message), ...optionalParams);
    }
  }

  public debug(message?: any, ...optionalParams: any[]): void {
    if (this.compare('DEBUG', this.level) >= 0) {
      this.logger.debug(...wrap('DEBUG', message), ...optionalParams);
    }
  }

  public info(message?: any, ...optionalParams: any[]): void {
    if (this.compare('INFO', this.level) >= 0) {
      this.logger.info(...wrap('INFO', message), ...optionalParams);
    }
  }

  public warn(message?: any, ...optionalParams: any[]): void {
    if (this.compare('WARN', this.level) >= 0) {
      this.logger.warn(...wrap('WARN', message), ...optionalParams);
    }
  }

  public error(message?: any, ...optionalParams: any[]): void {
    if (this.compare('ERROR', this.level) >= 0) {
      this.logger.error(...wrap('ERROR', message), ...optionalParams);
    }
  }
}
