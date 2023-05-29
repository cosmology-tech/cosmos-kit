import { Discriminators, isChainRecord, Options } from '@cosmos-kit/core';
import { enableDiscriminator } from '../methods/enable';
import { AddChainParamsDiscriminator } from '../type-guards';

export namespace GetAccountParams {
  interface General {
    chainId: string;
  }
  export type Key = General;
  export type EnigmaPubKey = General;
  export interface Secret20ViewingKey extends General {
    contractAddress: string;
  }
  export interface EnigmaTxEncryptionKey extends General {
    nonce: Uint8Array;
  }
}

export const discriminators: Discriminators = {
  enable: enableDiscriminator,

  disable: {
    cosmos: {
      ikeplr_disable: true,
    },
  },

  getAccount: {
    cosmos: {
      ikeplr_getKey: (
        params: unknown,
        options?: Options
      ): params is GetAccountParams.Key => {
        return true;
      },
      ikeplr_getSecret20ViewingKey: true,
      ikeplr_getEnigmaPubKey: true,
      ikeplr_getEnigmaTxEncryptionKey: true,
    },
  },

  addChain: {
    cosmos: {
      ikeplr_experimentalSuggestChain:
        AddChainParamsDiscriminator.Cosmos.isChainInfo,
      ikeplr_addChainRecord: isChainRecord,
    },
  },

  sign: {
    cosmos: {
      ikeplr_signAmino: SignParamsDiscriminator.Cosmos.isAmino,
      ikeplr_signDirect: SignParamsDiscriminator.Cosmos.isDirect,
      ikeplr_signICNSAdr36: SignParamsDiscriminator.Cosmos.isMessage,
      ikeplr_signArbitrary: SignParamsDiscriminator.Cosmos.isArbitrary,
    },
    ethereum: {
      ikeplr_signICNSAdr36: SignParamsDiscriminator.Cosmos.isMessage,
      ikeplr_signEthereum: SignParamsDiscriminator.Cosmos.isMessage,
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
