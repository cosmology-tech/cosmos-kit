// Wallet
export const ClientNotExistError = new Error('Client Not Exist!');
export const RejectedError = new Error('Request Rejected!');

// QRCode
export const ExpiredError = new Error('Expired!');

export class WalletNotProvidedError extends Error {
  readonly walletName: string;

  constructor(walletName: string) {
    super(`Wallet ${walletName} is not provided.`);
    this.walletName = walletName;
  }
}

export class ConnectError extends Error {
  readonly name = 'ConnectError';

  constructor(message?: string) {
    super(message);
  }
}
