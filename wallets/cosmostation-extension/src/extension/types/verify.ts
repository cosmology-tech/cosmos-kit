import { StdSignature } from '@cosmjs/amino';
import { VerifyMessageResponse } from '@cosmostation/extension-client/types/message';
import { SignParams } from './sign';

export type VerifyParamsType = VerifyParams.Cosmos.Message;

export namespace VerifyParams {
  export namespace Cosmos {
    export interface Message {
      publicKey: string;
      signature: string;
    }
    export interface Arbitrary extends SignParams.Cosmos.Arbitrary {
      signature: StdSignature;
    }
  }
}

export namespace VerifyResult {
  export namespace Cosmos {
    export type Message = VerifyMessageResponse;
  }
}
