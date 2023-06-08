import { Discriminators, Options } from '@cosmos-kit/core';
import {
  AddChainParamsDiscriminator,
  GetAccountParamsDiscriminator,
  SignParamsDiscriminator,
} from '../type-guards';

export const discriminators: Discriminators = {
  enable: {
    cosmos: {
      ikeplr_enable: true,
    },
  },

  disable: {
    cosmos: {
      ikeplr_disable: true,
    },
  },

  addChain: {
    cosmos: {
      ikeplr_experimentalSuggestChain:
        AddChainParamsDiscriminator.Cosmos.isChainInfo,
      ikeplr_addChainRecord: AddChainParamsDiscriminator.Cosmos.isChainRecord,
    },
  },

  getAccount: {
    cosmos: {
      ikeplr_getKey: GetAccountParamsDiscriminator.Cosmos.isKey,
      ikeplr_getEnigmaPubKey:
        GetAccountParamsDiscriminator.Cosmos.isEnigmaPubKey,
      ikeplr_getEnigmaTxEncryptionKey:
        GetAccountParamsDiscriminator.Cosmos.isEnigmaTxEncryptionKey,
      ikeplr_getSecret20ViewingKey:
        GetAccountParamsDiscriminator.Cosmos.isSecret20ViewingKey,
    },
  },

  sign: {
    cosmos: {
      ikeplr_signAmino: SignParamsDiscriminator.Cosmos.isAmino,
      ikeplr_signDirect: SignParamsDiscriminator.Cosmos.isDirect,
      ikeplr_signICNSAdr36: SignParamsDiscriminator.Cosmos.isICNSAdr36,
      ikeplr_signArbitrary: SignParamsDiscriminator.Cosmos.isArbitrary,
    },
    ethereum: {
      ikeplr_signICNSAdr36: SignParamsDiscriminator.Ethereum.isICNSAdr36,
      ikeplr_signEthereum: SignParamsDiscriminator.Ethereum.isEthereum,
    },
  },

  verify: {
    cosmos: {
      ikeplr_verifyArbitrary: VerifyParamsDiscriminator.Cosmos.isArbitrary,
    },
  },

  broadcast: {
    cosmos: {
      ikeplr_sendTx: BroadcastParamsDiscriminator.Cosmos.isTransaction,
    },
  },
};
