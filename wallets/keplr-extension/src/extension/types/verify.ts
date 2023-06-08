import {
  AminoSignResponse,
  DirectSignResponse,
  StdSignature,
  ICNSAdr36Signatures,
} from '@keplr-wallet/types';

export type VerifyParamsType = VerifyParams.Cosmos.Arbitrary;

export namespace VerifyParams {
  export namespace Cosmos {
    export interface Arbitrary {
      chainId: string;
      signer: string;
      data: string | Uint8Array;
      signature: StdSignature;
    }
  }
}

export namespace SignResp {
  export namespace Cosmos {
    export type Arbitrary = boolean;
  }
}
