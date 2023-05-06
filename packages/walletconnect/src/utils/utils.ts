import { Namespace } from '@cosmos-kit/core';
import { defaultEnableOptions, validators } from '../config';
import { WalletConnectOptions } from '../types';

export function getPrefix(namespace: Namespace): string {
  const prefix = defaultEnableOptions[namespace]?.prefix as string;
  if (!prefix) {
    throw new Error(
      `No matched prefix in WalletConnect for namespace ${namespace}.`
    );
  }
  return prefix;
}

export function getMethod(
  type: 'sign' | 'signAndBroadcast',
  namespace: Namespace,
  params: unknown,
  options?: WalletConnectOptions['signOptions']
): string {
  const validatorMap = validators[type][namespace];

  if (typeof validatorMap === 'undefined') {
    throw new Error(`Unmatched namespace: ${namespace}.`);
  }

  const methods = Object.entries(validatorMap)
    .filter(([, isValid]) => isValid(params, options))
    .map(([method]) => method);

  if (methods.length === 0) {
    throw new Error('Unmatched doc type.');
  }
  if (methods.length > 1) {
    throw new Error(
      `This doc passes multiple validators. Corresponsing methods are ${methods}`
    );
  }
  return methods[0];
}
