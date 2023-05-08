import {
  EncodedString,
  Namespace,
  NamespaceOptions,
  TypedArrayType,
  TypeName,
  ValidatorMap,
} from '../types';

type Key2Type = { [k: string]: TypeName | TypedArrayType };

export function hasRequiredKeyType(arg: any, key2type: Key2Type): boolean {
  if (typeof arg === 'undefined') {
    return false;
  }
  return (
    typeof arg === 'object' &&
    Object.entries(key2type).filter(
      ([key, _type]) =>
        typeof arg[key] !== _type || arg[Symbol.toStringTag] !== _type
    ).length === 0
  );
}

export function hasOptionalKeyType(arg: any, key2type: Key2Type): boolean {
  if (typeof arg === 'undefined') {
    return false;
  }
  return (
    typeof arg === 'object' &&
    Object.entries(key2type).filter(([key, _type]) => {
      if (typeof arg[key] === 'undefined') {
        return false;
      }
      return typeof arg[key] !== _type || arg[Symbol.toStringTag] !== _type;
    }).length === 0
  );
}

export function isArray(
  arg: any,
  itemType?: TypeName | TypedArrayType | Key2Type
): boolean {
  if (typeof arg === 'undefined') {
    return false;
  }
  if (Array.isArray(arg)) {
    if (arg.length === 0 || typeof itemType === 'undefined') {
      return true;
    } else {
      if (
        typeof arg[0] === itemType ||
        arg[Symbol.toStringTag] === itemType ||
        hasRequiredKeyType(arg[0], itemType as Key2Type)
      ) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
}

export function isEncodedString(arg: unknown): arg is EncodedString {
  return hasRequiredKeyType(arg, { value: 'string' });
}

export function isMessageDoc(doc: unknown, options?: unknown): doc is string {
  return typeof doc === 'string';
}

export function getMethod(
  validatorMap: ValidatorMap,
  namespace: Namespace,
  params: unknown,
  options?: NamespaceOptions
): string {
  if (typeof options?.[namespace]?.method !== 'undefined') {
    return options?.[namespace]?.method;
  }

  const method2validator = validatorMap[namespace];

  if (typeof method2validator === 'undefined') {
    throw new Error(`Unmatched namespace: ${namespace}.`);
  }

  const methods = Object.entries(method2validator)
    .filter(([, isValid]) => isValid(params, options))
    .map(([method]) => method);

  if (methods.length === 0) {
    throw new Error('Cannot find a proper method for this params.');
  }
  if (methods.length > 1) {
    throw new Error(
      `Params passes multiple validators. Corresponsing methods are ${methods}`
    );
  }
  return methods[0];
}
