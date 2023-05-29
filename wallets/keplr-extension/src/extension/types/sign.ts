import { KeplrSignOptions, StdSignDoc } from '@keplr-wallet/types';

export type SignParamsType = SignParams.Cosmos.Amino | SignParams.Cosmos.Direct;

export namespace SignParams {
  export namespace Cosmos {
    interface Transaction<T> {
      chainId: string;
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
  }
}
