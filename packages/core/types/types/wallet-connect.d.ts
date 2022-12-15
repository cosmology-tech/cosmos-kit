import { Algo } from '@cosmjs/amino';
export interface WCAccount {
    algo: Algo;
    address: string;
    pubkey: string;
    isNanoLedger?: boolean;
}
