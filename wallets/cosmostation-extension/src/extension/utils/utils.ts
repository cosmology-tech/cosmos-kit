import { Namespace } from '@cosmos-kit/core';
import { SignOptions } from '@cosmostation/extension-client/types/message';
import { validators } from '../config';

export function getMethod(
  type: keyof typeof validators,
  namespace: Namespace,
  params: unknown,
  options?: SignOptions
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
