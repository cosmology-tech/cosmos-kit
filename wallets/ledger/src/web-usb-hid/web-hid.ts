
import { LedgerMainWallet } from './main-wallet';
import { LedgerInfo } from './registry';

const ledger = new LedgerMainWallet(
  LedgerInfo, undefined, 'WebHID'
);

export const wallets = [ledger];