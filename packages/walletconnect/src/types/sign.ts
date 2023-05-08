import { StdSignature } from '@cosmjs/amino';
import { GenericCosmosDoc } from '@cosmos-kit/cosmos';
import { GenericEthDoc } from '@cosmos-kit/ethereum';
import { BeyondParams } from './types';

export interface SignParamsType extends BeyondParams {
  params:
    | SignParams.Cosmos.Amino
    | SignParams.Cosmos.Direct
    | SignParams.Ethereum.PersonalSign
    | SignParams.Ethereum.Sign
    | SignParams.Ethereum.Transaction
    | SignParams.Ethereum.TypedData
    | SignParams.Everscale.Message
    | SignParams.Everscale.Sign
    | SignParams.NEAR.Transaction
    | SignParams.NEAR.Transactions
    | SignParams.Solana.Message
    | SignParams.Solana.Transaction
    | SignParams.Stella.XDR
    | SignParams.Tezos.Sign
    | SignParams.XRPL.Transaction
    | SignParams.XRPL.TransactionFor;
}

export namespace SignParams {
  export namespace Cosmos {
    export interface Amino {
      signerAddress: string;
      signDoc: GenericCosmosDoc.Amino;
    }
    export interface Direct {
      signerAddress: string;
      signDoc: {
        chainId: string;
        accountNumber: string;
        bodyBytes: string;
        authInfoBytes: string;
      };
    }
  }

  export namespace Ethereum {
    type Signer = string;
    export type PersonalSign = [string, Signer];
    export type Sign = [Signer, string];
    export type Transaction = GenericEthDoc.Transaction[];
    export type TypedData = [Signer, GenericEthDoc.TypedData];
  }

  export namespace Everscale {
    export interface Sign {
      source_address: string;
      message: string; // in base64
    }
    /**
     * TODO: Confirm the interface of Message with WalletConnect team
     */
    export interface Message {
      source_address: string;
      value?: number;
      bounce?: boolean;
      dest_address?: string;
      dest_payload?: string;
      dest_abi?: string;
    }
  }

  export namespace Solana {
    /**
     * TODO: Confirm the interface of Message with WalletConnect team: partialSignatures/signatures
     */
    export interface Transaction {
      feePayer: string;
      instructions: {
        programId: string;
        data?: string;
        keys: { isSigner: boolean; isWritable: boolean; pubkey: string }[];
      }[];
      recentBlockhash: string;
      partialSignatures?: { pubkey: string; signature: string }[];
    }
    export interface Message {
      pubkey: string;
      message: string; // in base58
    }
  }

  export namespace Stella {
    export interface XDR {
      xdr: string;
    }
  }

  export namespace Tezos {
    export interface Sign {
      account: string;
      payload: string;
    }
  }

  export namespace NEAR {
    export interface Transaction {
      transaction: Uint8Array;
    }
    export interface Transactions {
      transactions: Uint8Array[];
    }
  }

  export namespace XRPL {
    export interface Transaction {
      /**
       * TO BE COMPLETED
       */
      tx_json: {
        Account: string;
        TransactionType: string;
        Fee?: string;
        Sequence?: number;
        AccountTxnID?: string;
        Flags?: number;
      };
      autofill?: boolean;
      submit: false;
    }
    export interface TransactionFor {
      tx_signer: string;
      tx_json: SignParams.XRPL.Transaction['tx_json'];
      autofill?: boolean;
      submit?: boolean;
    }
  }
}

export namespace SignResult {
  export namespace Cosmos {
    export interface Direct {
      signature: StdSignature;
      signed: SignParams.Cosmos.Direct;
    }
    export interface Amino {
      signature: StdSignature;
      signed: SignParams.Cosmos.Amino;
    }
  }

  export namespace Ethereum {
    export type PersonalSign = string;
    export type Sign = string;
    export type TypedData = string;
    export type Transaction = string;
  }

  export namespace Everscale {
    export interface Sign {
      signature: string;
      pubkey: string;
    }

    export interface Message {
      signed_ext_message: string;
    }
  }

  export namespace Solana {
    export interface Transaction {
      signature: string;
    }
    export type Message = SignResult.Solana.Transaction;
  }

  export namespace Stella {
    export interface XDR {
      signedXDR: string;
    }
  }

  export namespace XRPL {
    export interface Transaction {
      tx_json: {
        TxnSignature: string;
        SigningPubKey: string;
      } & SignParams.XRPL.Transaction['tx_json'];
    }
    export type TransactionFor = SignResult.XRPL.Transaction;
  }
}
