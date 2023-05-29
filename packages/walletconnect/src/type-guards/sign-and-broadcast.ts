import { hasRequiredKeyType, isArray, Options } from '@cosmos-kit/core';
import { SignAndBroadcastParams } from '../types';
import { SignParamsDiscriminator } from './sign';

export const SignAndBroadcastParamsDiscriminator = {
  Ethereum: {
    isTransaction(
      params: unknown,
      options?: Options
    ): params is SignAndBroadcastParams.Stella.XDR {
      return SignParamsDiscriminator.Ethereum.isTransaction(params);
    },
  },
  Everscale: {
    isMessage(
      params: unknown,
      options?: Options
    ): params is SignAndBroadcastParams.Stella.XDR {
      return SignParamsDiscriminator.Everscale.isMessage(params);
    },
  },
  Stella: {
    isXDR(
      params: unknown,
      options?: Options
    ): params is SignAndBroadcastParams.Stella.XDR {
      return hasRequiredKeyType(params, { xdr: 'string' });
    },
  },
  Tezos: {
    isSend(
      params: unknown,
      options?: Options
    ): params is SignAndBroadcastParams.Tezos.Send {
      return (
        hasRequiredKeyType(params, { account: 'string' }) &&
        isArray(params['operations'], {
          kind: 'string',
          destination: 'string',
          amount: 'string',
        })
      );
    },
  },
  XRPL: {
    isTransaction(
      params: unknown,
      options?: Options
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
      options?: Options
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
