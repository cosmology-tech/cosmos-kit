
import { LedgerMainWallet } from './main-wallet';
import { LedgerInfo } from './registry';

const ledger = new LedgerMainWallet(
  LedgerInfo, undefined, 'WebUSB'
);

export const wallets = [ledger];