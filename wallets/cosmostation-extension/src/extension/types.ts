import { Algo } from '@cosmjs/proto-signing';
import { Keplr } from '@keplr-wallet/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CosmostationSignOptions {
  readonly preferNoSetFee?: boolean;
  readonly preferNoSetMemo?: boolean;
  readonly disableBalanceCheck?: boolean;
}

export interface Request {
  method: string;
  params?: object;
}

export interface Cosmos {
  request(request: Request): Promise<any>;
  on(type: string, listener: EventListenerOrEventListenerObject): Event;
  off(event: Event): void;
}

export interface Cosmostation {
  cosmos: Cosmos;
  providers: {
    keplr: Keplr;
  };
}

export type RequestAccountResponse = {
  name: string;
  address: string;
  publicKey: Uint8Array;
  isLedger: boolean;
  algo: Algo;
};
