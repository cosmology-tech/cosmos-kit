import { Discriminators } from '@cosmos-kit/core';

export const discriminators: Discriminators = {
  enable: {
    cosmos: {
      cos_enable: true,
    },
  },

  getAccount: {
    cosmos: {
      cos_getKey: true,
    },
  },

  addChain: {
    cosmos: {
      cos_experimentalSuggestChain: true,
      cos_addChainRecord: (),
    },
  },

  sign: {
    cosmos: {
      cos_signMessage: SignParamsDiscriminator.Cosmos.isMessage,
      cos_signAmino: SignParamsDiscriminator.Cosmos.isAmino,
      cos_signDirect: SignParamsDiscriminator.Cosmos.isDirect,
      cos_signArbitrary: SignParamsDiscriminator.Cosmos.isArbitrary,
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
      cos_verifyMessage: VerifyParamsDiscriminator.Cosmos.isMessage,
      ikeplr_verifyArbitrary: VerifyParamsDiscriminator.Cosmos.isArbitrary,
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
