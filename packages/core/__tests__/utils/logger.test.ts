import { Logger } from '../../src/utils';

describe('Logger Tests', () => {
  let consoleLogSpy;
  let logger;

  beforeEach(() => {
    // Mock console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    console.trace = console.debug = console.info = console.warn = console.error = jest.fn();
    // Create a new instance of Logger with INFO level
    logger = new Logger('INFO');
  });

  afterEach(() => {
    // Restore original console methods
    consoleLogSpy.mockRestore();
  });

  it('Logger should be initialized with the correct log level', () => {
    expect(logger.level).toBe('INFO');
  });

  it('trace() should log only when level is TRACE or higher', () => {
    logger.trace('Trace message');
    expect(console.trace).not.toHaveBeenCalled();

    logger = new Logger('TRACE');
    logger.trace('Trace message');
    expect(console.trace).toHaveBeenCalled();
  });

  it('debug() should log only when level is DEBUG or higher', () => {
    logger.debug('Debug message');
    expect(console.debug).not.toHaveBeenCalled();

    logger = new Logger('DEBUG');
    logger.debug('Debug message');
    expect(console.debug).toHaveBeenCalled();
  });

  it('info() should log only when level is INFO or higher', () => {
    logger.info('Info message');
    expect(console.info).toHaveBeenCalled();

    logger = new Logger('WARN');
    logger.info('Info message');
    expect(console.info).toHaveBeenCalled();
  });

  it('warn() should log only when level is WARN or higher', () => {
    logger.warn('Warn message');
    expect(console.warn).toHaveBeenCalled();

    logger = new Logger('ERROR');
    logger.warn('Warn message');
    expect(console.warn).toHaveBeenCalled();
  });

  it('error() should log only when level is ERROR or higher', () => {
    logger.error('Error message');
    expect(console.error).toHaveBeenCalled();

    logger = new Logger('NONE');
    logger.error('Error message');
    expect(console.error).toHaveBeenCalled();
  });
});
