import {
  hasOptionalKeyType,
  hasRequiredKeyType,
  isArray,
} from '@cosmos-kit/core';
import { GenericCosmosDocDiscriminator } from '@cosmos-kit/cosmos';
import { GenericEthDocDiscriminator } from '@cosmos-kit/ethereum';
import { SignOptionsMap, SignParams } from '../types';

export const SignParamsDiscriminator = {
  Cosmos: {
    isAmino(
      params: unknown,
      options?: SignOptionsMap
    ): params is SignParams.Cosmos.Direct {
      return (
        hasRequiredKeyType(params, { signerAddress: 'string' }) &&
        GenericCosmosDocDiscriminator.isAmino(params['signDoc'])
      );
    },
    isDirect(
      params: unknown,
      options?: SignOptionsMap
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
    _check: (
      method: string,
      params: unknown,
      options?: SignOptionsMap
    ): boolean => {
      if (typeof options?.ethereum?.method === 'undefined') {
        throw new Error('Please set `ethereum.method` in options.');
      }
      return (
        options?.ethereum?.method === method &&
        typeof params[0] === 'string' &&
        typeof params[1] === 'string'
      );
    },
    isTransaction(
      params: unknown,
      options?: SignOptionsMap
    ): params is SignParams.Ethereum.Transaction {
      return (
        Array.isArray(params) &&
        params.every((doc) => GenericEthDocDiscriminator.isTransaction(doc))
      );
    },
    isTypedData(
      params: unknown,
      options?: SignOptionsMap
    ): params is SignParams.Ethereum.TypedData {
      const [signer, doc] = params as any;
      return (
        typeof signer === 'string' &&
        GenericEthDocDiscriminator.isTypedData(doc)
      );
    },
    isPersonalSign(
      params: unknown,
      options?: SignOptionsMap
    ): params is SignParams.Ethereum.PersonalSign {
      return this._check('personal_sign', params, options);
    },
    isSign(
      params: unknown,
      options?: SignOptionsMap
    ): params is SignParams.Ethereum.Sign {
      return this._check('eth_sign', params, options);
    },
  },
  Everscale: {
    isSign(
      params: unknown,
      options?: SignOptionsMap
    ): params is SignParams.Everscale.Sign {
      return hasRequiredKeyType(params, {
        source_address: 'string',
        message: 'string',
      });
    },
    isMessage(
      params: unknown,
      options?: SignOptionsMap
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
      options?: SignOptionsMap
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
      options?: SignOptionsMap
    ): params is SignParams.Solana.Message {
      return hasRequiredKeyType(params, {
        message: 'string',
        pubkey: 'string',
      });
    },
  },
  Stella: {
    isXDR(
      params: unknown,
      options?: SignOptionsMap
    ): params is SignParams.Stella.XDR {
      return hasRequiredKeyType(params, { xdr: 'string' });
    },
  },
  Tezos: {
    isSign(
      params: unknown,
      options?: SignOptionsMap
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
      options?: SignOptionsMap
    ): params is SignParams.NEAR.Transaction {
      return isArray(params['transaction'], 'Uint8Array');
    },
    isTransactions(
      params: unknown,
      options?: SignOptionsMap
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
      options?: SignOptionsMap
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
      options?: SignOptionsMap
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
