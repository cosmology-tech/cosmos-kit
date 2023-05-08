import { Discriminators } from '@cosmos-kit/core';
import {
  BroadcastParamsDiscriminator,
  SignAndBroadcastParamsDiscriminator,
  SignParamsDiscriminator,
} from './type-guards';

export const discriminators: Discriminators = {
  sign: {
    cosmos: {
      cos_signMessage: SignParamsDiscriminator.Cosmos.isMessage,
      cos_signAmino: SignParamsDiscriminator.Cosmos.isAmino,
      cos_signDirect: SignParamsDiscriminator.Cosmos.isDirect,
    },
    ethereum: {
      eth_sign: SignParamsDiscriminator.Ethereum.isSign,
      eth_signTransaction: SignParamsDiscriminator.Ethereum.isTransaction,
      eth_signTypedData_v3: SignParamsDiscriminator.Ethereum.isTypedDataV3,
      eth_signTypedData_v4: SignParamsDiscriminator.Ethereum.isTypedDataV4,
    },
    aptos: {
      aptos_signMessage: SignParamsDiscriminator.Aptos.isMessage,
      aptos_signTransaction: SignParamsDiscriminator.Aptos.isTransaction,
    },
  },

  verify: {
    cosmos: {
      cos_verifyMessage: true, // Equivalent to the discriminator always returns true.
    },
  },

  broadcast: {
    cosmos: {
      cos_sendTransaction: BroadcastParamsDiscriminator.Cosmos.isTransaction,
    },
  },

  signAndBroadcast: {
    aptos: {
      aptos_signAndSubmitTransaction:
        SignAndBroadcastParamsDiscriminator.Aptos.isTransaction,
    },
    sui: {
      sui_signAndExecuteTransaction:
        SignAndBroadcastParamsDiscriminator.Sui.isTransaction,
    },
  },
};
