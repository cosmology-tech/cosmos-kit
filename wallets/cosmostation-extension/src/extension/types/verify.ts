import { ChainId } from '@cosmos-kit/core';
import { VerifyMessageResponse } from '@cosmostation/extension-client/types/message';

export type VerifyParamsType = VerifyParams.Cosmos.Message;

export namespace VerifyParams {
  export namespace Cosmos {
    export interface Message {
      chainName: ChainId;
      signer: string;
      message: string;
      publicKey: string;
      signature: string;
    }
  }
}

export namespace VerifyResult {
  export namespace Cosmos {
    export type Message = VerifyMessageResponse;
  }
}
