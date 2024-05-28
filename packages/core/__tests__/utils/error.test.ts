import { ConnectError, WalletNotProvidedError } from "../../src/utils";

describe('ConnectError', () => {
  it('should create an instance with the provided message', () => {
    const errorMessage = 'Test error message';
    const error = new ConnectError(errorMessage);
    expect(error).toBeInstanceOf(ConnectError);
    expect(error.message).toBe(errorMessage);
  });

  it('should create an instance with an empty message if no message is provided', () => {
    const error = new ConnectError();
    expect(error).toBeInstanceOf(ConnectError);
    expect(error.message).toBe('');
  });
});

describe('WalletNotProvidedError', () => {
  it('should create an instance with the provided message', () => {
    const walletName = 'Test wallet name';
    const error = new WalletNotProvidedError(walletName);
    expect(error).toBeInstanceOf(WalletNotProvidedError);
    expect(error.walletName).toBe(walletName);
  });
});
