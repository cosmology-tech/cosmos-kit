import { Discriminators } from '@cosmos-kit/core';
import { EnableOptionsMap } from './types';
import {
  BroadcastParamsDiscriminator,
  SignAndBroadcastParamsDiscriminator,
  SignParamsDiscriminator,
} from './utils';

export const defaultEnableOptions: EnableOptionsMap = {
  cosmos: {
    prefix: 'cosmos',
    methods: ['cosmos_getAccount', 'cosmos_signAmino', 'cosmos_signDirect'],
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

export const discriminators = {
  sign: {
    cosmos: {
      cosmos_signAmino: SignParamsDiscriminator.Cosmos.isAmino,
      cosmos_signDirect: SignParamsDiscriminator.Cosmos.isDirect,
    },
    ethereum: {
      personal_sign: SignParamsDiscriminator.Ethereum.isPersonalSign,
      eth_sign: SignParamsDiscriminator.Ethereum.isPersonalSign,
      eth_signTypedData: SignParamsDiscriminator.Ethereum.isTypedData,
      eth_signTransaction: SignParamsDiscriminator.Ethereum.isTransaction,
    },
    everscale: {
      ever_signMessage: SignParamsDiscriminator.Everscale.isMessage,
      ever_sign: SignParamsDiscriminator.Everscale.isSign,
    },
    solana: {
      solana_signTransaction: SignParamsDiscriminator.Solana.isTransaction,
      solana_signMessage: SignParamsDiscriminator.Solana.isMessage,
    },
    stella: { stellar_signXDR: SignParamsDiscriminator.Stella.isXDR },
    tezos: { tezos_sign: SignParamsDiscriminator.Tezos.isSign },
    near: {
      near_signTransaction: SignParamsDiscriminator.NEAR.isTransaction,
      near_signTransactions: SignParamsDiscriminator.NEAR.isTransactions,
    },
    xrpl: {
      xrpl_signTransaction: SignParamsDiscriminator.XRPL.isTransaction,
      xrpl_signTransactionFor: SignParamsDiscriminator.XRPL.isTransactionFor,
    },
  },

  broadcast: {
    ethereum: {
      eth_sendRawTransaction:
        BroadcastParamsDiscriminator.Ethereum.isRawTransaction,
    },
  },

  signAndBroadcast: {
    ethereum: {
      eth_signTransaction:
        SignAndBroadcastParamsDiscriminator.Ethereum.isTransaction,
    },
    everscale: {
      ever_processMessage:
        SignAndBroadcastParamsDiscriminator.Everscale.isMessage,
    },
    stella: {
      stellar_signAndSubmitXDR:
        SignAndBroadcastParamsDiscriminator.Stella.isXDR,
    },
    tezos: {
      tezos_send: SignAndBroadcastParamsDiscriminator.Tezos.isSend,
    },
    xrpl: {
      xrpl_signTransaction:
        SignAndBroadcastParamsDiscriminator.XRPL.isTransaction,
      xrpl_signTransactionFor:
        SignAndBroadcastParamsDiscriminator.XRPL.isTransactionFor,
    },
  },
};
