import { LedgerMainWallet, LedgerInfo } from './web-usb-hid';

// export const ledgerHID = new LedgerMainWallet(LedgerInfo, undefined, 'WebHID');
export const ledgerUSB = new LedgerMainWallet(LedgerInfo, undefined, 'WebUSB');

export const wallets = [ledgerUSB];
