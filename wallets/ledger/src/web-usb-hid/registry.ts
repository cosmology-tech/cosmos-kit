import logo from '../logo.svg';
import { Wallet } from '@cosmos-kit/core';

export const LedgerInfo: Wallet = {
  name: 'ledger-web-usb-hid',
  prettyName: 'Ledger',
  logo: logo,
  mode: 'ledger',
  mobileDisabled: true,
  rejectMessage: {
    source: 'Request rejected',
  }
};