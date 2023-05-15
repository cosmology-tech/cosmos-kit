// Wallet
export const ClientNotExistError = new Error('Client Not Exist!');
export const RejectedError = new Error('Request Rejected!');

// QRCode
export const ExpiredError = new Error('Expired!');

export const NoMethodError: Error = {
  name: 'NoMethodError',
  message: 'Cannot find a proper method for this params.',
};

export const NoSessionError: Error = {
  name: 'NoSessionError',
  message: 'No corresponding established session.',
};
