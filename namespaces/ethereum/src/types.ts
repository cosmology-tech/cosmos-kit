export namespace GenericEthDoc {
  export type HexString = string;
  export type Transaction = {
    from: string;
    data: string;
    to?: string;
    gas?: string;
    gasPrice?: string;
    value?: string;
    nonce?: string;
  };
  export interface TypedData {
    domain: object;
    message: object;
    primaryType: string;
    types: {
      EIP712Domain: { name: string; type: string }[];
    };
  }
}
