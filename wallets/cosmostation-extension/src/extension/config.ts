import { Discriminators, isGreedy, Options } from '@cosmos-kit/core';
import {
  BroadcastParamsDiscriminator,
  SignAndBroadcastParamsDiscriminator,
  SignParamsDiscriminator,
  VerifyParamsDiscriminator,
} from './type-guards';

export const discriminators: Discriminators = {
  enable: {
    cosmos: {
      ikeplr_enable: true,
    },
    aptos: {
      aptos_connect: true,
    },
    sui: {
      sui_connect: true,
    },
  },

  disable: {
    cosmos: {
      cos_disconnect: true,
    },
  },

  getAccount: {
    cosmos: {
      cos_account: false,
      cos_requestAccount: true,
    },
    ethereum: {
      eth_accounts: false,
      eth_requestAccounts: true,
    },
    aptos: {
      aptos_account: true,
    },
    sui: {
      sui_getAccount: true,
      sui_getPublicKey: isGreedy,
    },
  },

  addChain: {
    cosmos: {
      cos_addChain: true,
    },
    ethereum: {
      wallet_addEthereumChain: true,
    },
  },

  switchChain: {
    ethereum: {
      wallet_switchEthereumChain: true,
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
