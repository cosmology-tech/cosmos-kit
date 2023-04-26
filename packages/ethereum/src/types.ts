export namespace EthereumDoc {
  export type HexString = string;
  export type Transaction = {
    from: string;
    data: string;
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
