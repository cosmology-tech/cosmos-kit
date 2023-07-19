import { LogLevel } from '../types';

function wrap(logLevel: LogLevel, message?: any) {
  switch (logLevel) {
    case 'ERROR':
      return [`%c${logLevel} -`, 'color: Red;', message];
    case 'WARN':
      return [`%c${logLevel} -`, 'color: Orange;', message];
    case 'INFO':
      return [`%c${logLevel} -`, 'color: Blue;', message];
    case 'DEBUG':
      return [`%c${logLevel} -`, 'color: Purple;', message];
    case 'TRACE':
      return [`%c${logLevel} -`, 'color: Brown;', message];
  }
}

export class Logger {
  private readonly logger: Console;
  public readonly level: LogLevel;
  public readonly levelOrder: LogLevel[] = [
    'TRACE',
    'DEBUG',
    'INFO',
    'WARN',
    'ERROR',
    'NONE',
  ];

  public constructor(level: LogLevel = 'INFO') {
    this.logger = console;
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
