/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CosmostationSignOptions {
  readonly preferNoSetFee?: boolean;
  readonly preferNoSetMemo?: boolean;
  readonly disableBalanceCheck?: boolean;
}

export interface Request {
  method: string;
  params: object;
}

export interface Cosmostation {
  request(request: Request): Promise<any>;
  on(type: string, listener: EventListenerOrEventListenerObject): Event;
  off(event: Event): void;
}

export type RequestAccountResponse = {
  name: string;
  address: string;
  publicKey: Uint8Array;
  isLedger: boolean;
};
