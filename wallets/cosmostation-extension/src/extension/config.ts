import { ValidatorMap } from './types/types';
import {
  BroadcastParamsValidator,
  SignAndBroadcastParamsValidator,
  SignParamsValidator,
} from './utils';

export const validators: {
  [k in 'sign' | 'broadcast' | 'signAndBroadcast']: ValidatorMap;
} = {
  sign: {
    cosmos: {
      cos_signMessage: SignParamsValidator.Cosmos.isMessage,
      cos_signAmino: SignParamsValidator.Cosmos.isAmino,
      cos_signDirect: SignParamsValidator.Cosmos.isDirect,
    },
    ethereum: {
      eth_sign: SignParamsValidator.Ethereum.isSign,
      eth_signTypedData_v3: SignParamsValidator.Ethereum.isTypedDataV3,
      eth_signTypedData_v4: SignParamsValidator.Ethereum.isTypedDataV4,
      eth_signTransaction: SignParamsValidator.Ethereum.isTransaction,
    },
  },

  broadcast: {
    cosmos: {
      cos_sendTransaction: BroadcastParamsValidator.Cosmos.isTransaction,
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
