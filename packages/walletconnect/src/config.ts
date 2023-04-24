import { EnableOptionsMap } from './types';

export const defaultEnableOptions: EnableOptionsMap = {
  cosmos: {
    prefix: 'cosmos',
    methods: ['cosmos_getAccounts', 'cosmos_signAmino', 'cosmos_signDirect'],
    events: ['chainChanged', 'accountsChanged'],
  },
  ethereum: {
    prefix: 'eip155',
    methods: [
      'eth_sendTransaction',
      'eth_sendRawTransaction',
      'eth_signTransaction',
      'eth_sign',
      'personal_sign',
      'eth_signTypedData',
    ],
    events: ['chainChanged', 'accountsChanged'],
  },
};
