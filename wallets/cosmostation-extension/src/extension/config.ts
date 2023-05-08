import { Validators } from '@cosmos-kit/core';
import {
  BroadcastParamsValidator,
  SignAndBroadcastParamsValidator,
  SignParamsValidator,
} from './type-guards';

export const validators: Validators = {
  sign: {
    cosmos: {
      cos_signMessage: SignParamsValidator.Cosmos.isMessage,
      cos_signAmino: SignParamsValidator.Cosmos.isAmino,
      cos_signDirect: SignParamsValidator.Cosmos.isDirect,
    },
    ethereum: {
      eth_sign: SignParamsValidator.Ethereum.isSign,
      eth_signTransaction: SignParamsValidator.Ethereum.isTransaction,
      eth_signTypedData_v3: SignParamsValidator.Ethereum.isTypedDataV3,
      eth_signTypedData_v4: SignParamsValidator.Ethereum.isTypedDataV4,
    },
    aptos: {
      aptos_signMessage: SignParamsValidator.Aptos.isMessage,
      aptos_signTransaction: SignParamsValidator.Aptos.isTransaction,
    },
  },

  broadcast: {
    cosmos: {
      cos_sendTransaction: BroadcastParamsValidator.Cosmos.isTransaction,
    },
  },

  signAndBroadcast: {
    aptos: {
      aptos_signAndSubmitTransaction:
        SignAndBroadcastParamsValidator.Aptos.isTransaction,
    },
    sui: {
      sui_signAndExecuteTransaction:
        SignAndBroadcastParamsValidator.Sui.isTransaction,
    },
  },
};
