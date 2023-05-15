import { Algo } from '@cosmjs/amino';

export namespace GetAccountResult {
  export interface Cosmos {
    name: string;
    address: string;
    publicKey: Uint8Array;
    isLedger: boolean;
    algo: Algo;
  }
  export interface Aptos {
    address: string;
    publicKey: string;
  }
}
