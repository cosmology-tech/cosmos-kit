import {
  hasOptionalKeyType,
  hasRequiredKeyType,
  isArray,
} from '@cosmos-kit/core';
import { GenericCosmosDocValidator } from '@cosmos-kit/cosmos';
import { GenericEthDocValidator } from '@cosmos-kit/ethereum';
import {
  SignAndBroadcastParams,
  SignParams,
  WalletConnectOptions,
} from '../types';

export const SignParamsValidator = {
  Cosmos: {
    isAmino(
      params: unknown,
      options?: unknown
    ): params is SignParams.Cosmos.Direct {
      return (
        hasRequiredKeyType(params, { signerAddress: 'string' }) &&
        GenericCosmosDocValidator.isAmino(params['signDoc'])
      );
    },
    isDirect(
      params: unknown,
      options?: unknown
    ): params is SignParams.Cosmos.Direct {
      return (
        hasRequiredKeyType(params, { signerAddress: 'string' }) &&
        hasRequiredKeyType(params['signDoc'], {
          chainId: 'string',
          accountNumber: 'string',
          bodyBytes: 'string',
          authInfoBytes: 'string',
        })
      );
    },
  },
  Ethereum: {
    isTransaction(
      params: unknown,
      options?: unknown
    ): params is SignParams.Ethereum.Transaction {
      return (
        Array.isArray(params) &&
        params.every((doc) => GenericEthDocValidator.isTransaction(doc))
      );
    },
    isTypedData(
      params: unknown,
      options?: unknown
    ): params is SignParams.Ethereum.TypedData {
      const [signer, doc] = params as any;
      return (
        typeof signer === 'string' && GenericEthDocValidator.isTypedData(doc)
      );
    },
    isPersonalSign(
      params: unknown,
      options?: WalletConnectOptions['signOptions']
    ): params is SignParams.Ethereum.PersonalSign {
      if (typeof options?.ethereum?.signHexString === 'undefined') {
        throw new Error('Please set `ethereum.signHexString` in options.');
      }
      const [doc, signer] = params as any;
      return (
        typeof doc == 'string' &&
        typeof signer == 'string' &&
        options?.ethereum?.signHexString === 'personal_sign'
      );
    },
    isSign(
      params: unknown,
      options?: WalletConnectOptions['signOptions']
    ): params is SignParams.Ethereum.Sign {
      if (typeof options?.ethereum?.signHexString === 'undefined') {
        throw new Error('Please set `ethereum.signHexString` in options.');
      }
      const [signer, doc] = params as any;
      return (
        typeof doc == 'string' &&
        typeof signer == 'string' &&
        options?.ethereum?.signHexString === 'eth_sign'
      );
    },
  },
  Everscale: {
    isSign(
      params: unknown,
      options?: unknown
    ): params is SignParams.Everscale.Sign {
      return hasRequiredKeyType(params, {
        source_address: 'string',
        message: 'string',
      });
    },
    isMessage(
      params: unknown,
      options?: unknown
    ): params is SignParams.Everscale.Message {
      return (
        hasRequiredKeyType(params, { source_address: 'string' }) &&
        hasOptionalKeyType(params, {
          value: 'number',
          bounce: 'boolean',
          dest_address: 'string',
          dest_payload: 'string',
          dest_abi: 'string',
        })
      );
    },
  },
  Solana: {
    isTransaction(
      params: unknown,
      options?: unknown
    ): params is SignParams.Solana.Transaction {
      return (
        hasRequiredKeyType(params, {
          feePayer: 'string',
          recentBlockhash: 'string',
        }) && isArray(params['instructions'], { programId: 'string' })
      );
    },
    isMessage(
      params: unknown,
      options?: unknown
    ): params is SignParams.Solana.Message {
      return hasRequiredKeyType(params, {
        message: 'string',
        pubkey: 'string',
      });
    },
  },
  Stella: {
    isXDR(params: unknown, options?: unknown): params is SignParams.Stella.XDR {
      return hasRequiredKeyType(params, { xdr: 'string' });
    },
  },
  Tezos: {
    isSign(
      params: unknown,
      options?: unknown
    ): params is SignParams.Tezos.Sign {
      return hasRequiredKeyType(params, {
        account: 'string',
        payload: 'string',
      });
    },
  },
  NEAR: {
    isTransaction(
      params: unknown,
      options?: unknown
    ): params is SignParams.NEAR.Transaction {
      return isArray(params['transaction'], 'Uint8Array');
    },
    isTransactions(
      params: unknown,
      options?: unknown
    ): params is SignParams.NEAR.Transactions {
      const { transactions } = params['transactions'];
      return (
        Array.isArray(transactions) &&
        transactions.every((tx) => isArray(tx, 'Uint8Array'))
      );
    },
  },
  XRPL: {
    isTransaction(
      params: unknown,
      options?: unknown
    ): params is SignParams.XRPL.Transaction {
      const notSubmit = params['submit'] === false;
      return (
        notSubmit &&
        hasRequiredKeyType(params['tx_json'], {
          Account: 'string',
          TransactionType: 'string',
        })
      );
    },
    isTransactionFor(
      params: unknown,
      options?: unknown
    ): params is SignParams.XRPL.TransactionFor {
      const notSubmit =
        params['submit'] === false || typeof params['submit'] === 'undefined';
      return (
        notSubmit &&
        hasRequiredKeyType(params, { tx_signer: 'string' }) &&
        hasRequiredKeyType(params['tx_json'], {
          Account: 'string',
          TransactionType: 'string',
        })
      );
    },
  },
};

export const SignAndBroadcastParamsValidator = {
  Stella: {
    isXDR(
      params: unknown,
      options?: unknown
    ): params is SignAndBroadcastParams.Stella.XDR {
      return hasRequiredKeyType(params, { xdr: 'string' });
    },
  },
  XRPL: {
    isTransaction(
      params: unknown,
      options?: unknown
    ): params is SignAndBroadcastParams.XRPL.Transaction {
      const submit =
        params['submit'] === true || typeof params['submit'] === 'undefined';
      return (
        submit &&
        hasRequiredKeyType(params['tx_json'], {
          Account: 'string',
          TransactionType: 'string',
        })
      );
    },
    isTransactionFor(
      params: unknown,
      options?: unknown
    ): params is SignAndBroadcastParams.XRPL.TransactionFor {
      const submit = params['submit'] === true;
      return (
        submit &&
        hasRequiredKeyType(params, { tx_signer: 'string' }) &&
        hasRequiredKeyType(params['tx_json'], {
          Account: 'string',
          TransactionType: 'string',
        })
      );
    },
  },
};
