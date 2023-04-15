import { EncodedString, TypedArrayType, TypeName } from '../types';

type Key2Type = { [k: string]: TypeName | TypedArrayType };

export function hasKeyType(arg: any, key2type: Key2Type): boolean {
  if (typeof arg === 'undefined') {
    return false;
  }
  return (
    typeof arg === 'object' &&
    Object.entries(key2type).filter(
      ([key, _type]) =>
        typeof arg[key] !== _type || arg[Symbol.toStringTag] === _type
    ).length === 0
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
        hasKeyType(arg[0], itemType as Key2Type)
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
  return hasKeyType(arg, { value: 'string' });
}

export function isMessageDoc(doc: unknown): doc is string {
  return typeof doc === 'string';
}
