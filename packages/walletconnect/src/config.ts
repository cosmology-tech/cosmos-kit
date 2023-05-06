import { EnableOptionsMap, ValidatorMap } from './types/types';
import {
  BroadcastParamsValidator,
  SignAndBroadcastParamsValidator,
  SignParamsValidator,
} from './utils';

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
  everscale: {
    prefix: 'ever', // TO CONFIRM
    methods: ['ever_processMessage', 'ever_signMessage', 'ever_sign'],
    events: ['chainChanged', 'accountsChanged'],
  },
};

export const validators: {
  [k in 'sign' | 'broadcast' | 'signAndBroadcast']: ValidatorMap;
} = {
  sign: {
    cosmos: {
      cosmos_signAmino: SignParamsValidator.Cosmos.isAmino,
      cosmos_signDirect: SignParamsValidator.Cosmos.isDirect,
    },
    ethereum: {
      personal_sign: SignParamsValidator.Ethereum.isPersonalSign,
      eth_sign: SignParamsValidator.Ethereum.isPersonalSign,
      eth_signTypedData: SignParamsValidator.Ethereum.isTypedData,
      eth_signTransaction: SignParamsValidator.Ethereum.isTransaction,
    },
    everscale: {
      ever_signMessage: SignParamsValidator.Everscale.isMessage,
      ever_sign: SignParamsValidator.Everscale.isSign,
    },
    solana: {
      solana_signTransaction: SignParamsValidator.Solana.isTransaction,
      solana_signMessage: SignParamsValidator.Solana.isMessage,
    },
    stella: { stellar_signXDR: SignParamsValidator.Stella.isXDR },
    tezos: { tezos_sign: SignParamsValidator.Tezos.isSign },
    near: {
      near_signTransaction: SignParamsValidator.NEAR.isTransaction,
      near_signTransactions: SignParamsValidator.NEAR.isTransactions,
    },
    xrpl: {
      xrpl_signTransaction: SignParamsValidator.XRPL.isTransaction,
      xrpl_signTransactionFor: SignParamsValidator.XRPL.isTransactionFor,
    },
  },

  broadcast: {
    ethereum: {
      eth_sendRawTransaction:
        BroadcastParamsValidator.Ethereum.isRawTransaction,
    },
  },

  signAndBroadcast: {
    ethereum: {
      eth_signTransaction:
        SignAndBroadcastParamsValidator.Ethereum.isTransaction,
    },
    everscale: {
      ever_processMessage: SignAndBroadcastParamsValidator.Everscale.isMessage,
    },
    stella: {
      stellar_signAndSubmitXDR: SignAndBroadcastParamsValidator.Stella.isXDR,
    },
    tezos: {
      tezos_send: SignAndBroadcastParamsValidator.Tezos.isSend,
    },
    xrpl: {
      xrpl_signTransaction: SignAndBroadcastParamsValidator.XRPL.isTransaction,
      xrpl_signTransactionFor:
        SignAndBroadcastParamsValidator.XRPL.isTransactionFor,
    },
  },
};
