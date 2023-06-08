import {
  AminoSignResponse,
  DirectSignResponse,
  StdSignature,
  ICNSAdr36Signatures,
  KeplrSignOptions,
  StdSignDoc,
  EthSignType,
} from '@keplr-wallet/types';

export type SignParamsType =
  | SignParams.Cosmos.Amino
  | SignParams.Cosmos.Direct
  | SignParams.Cosmos.Arbitrary
  | SignParams.Cosmos.ICNSAdr36
  | SignParams.Ethereum.ICNSAdr36
  | SignParams.Ethereum.Ethereum;

export namespace SignParams {
  export namespace Cosmos {
    interface Base {
      chainId: string;
    }

    interface Transaction<T> extends Base {
      signer: string;
      signDoc: T;
      signOptions?: KeplrSignOptions;
    }

    interface DirectSignDoc {
      /** SignDoc bodyBytes */
      bodyBytes?: Uint8Array | null;
      /** SignDoc authInfoBytes */
      authInfoBytes?: Uint8Array | null;
      /** SignDoc chainId */
      chainId?: string | null;
      /** SignDoc accountNumber */
      accountNumber?: Long | null;
    }

    export type Direct = Transaction<DirectSignDoc>;

    export type Amino = Transaction<StdSignDoc>;

    export interface ICNSAdr36 extends Base {
      contractAddress: string;
      owner: string;
      username: string;
      addressChainIds: string[];
    }

    export interface Arbitrary extends Base {
      signer: string;
      data: string | Uint8Array;
    }
  }

  export namespace Ethereum {
    export type ICNSAdr36 = SignParams.Cosmos.ICNSAdr36;
    export interface Ethereum {
      chainId: string;
      signer: string;
      data: string | Uint8Array;
      type: EthSignType;
    }
  }
}

export namespace SignResp {
  export namespace Cosmos {
    export type Direct = DirectSignResponse;
    export type Amino = AminoSignResponse;
    export type ICNSAdr36 = ICNSAdr36Signatures;
    export type Arbitrary = StdSignature;
  }

  export namespace Ethereum {
    export type ICNSAdr36 = ICNSAdr36Signatures;
    export type Ethereum = Uint8Array;
  }
}
