import {
  EncodedString,
  TypedArrayType,
  TypeName,
  DiscriminatorMap,
  Args,
  ReqArgs,
  Options,
  Discriminator,
} from '../types';
import { NoMatchedMethodError } from './error';

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

export const isGreedy: Discriminator = (params: unknown, options?: Options) => {
  return Boolean(options?.greedy);
};

export function getRequestArgsList(
  discriminatorMap: DiscriminatorMap | undefined,
  args: Args.General | Args.General[]
): ReqArgs[] {
  if (!discriminatorMap) {
    throw NoMatchedMethodError;
  }

  function _getMethods(args: Args.General) {
    const { namespace, params, options } = args;
    const method = options?.method;
    if (typeof method !== 'undefined') {
      return [{ ...args, method }];
    }

    const method2discriminator = discriminatorMap[namespace];

    if (typeof method2discriminator === 'undefined') {
      throw NoMatchedMethodError;
    }

    const reqArgs = Object.entries(method2discriminator)
      .filter(([, discriminate]) => {
        if (typeof discriminate === 'boolean') {
          return discriminate;
        } else {
          return discriminate(params, options);
        }
      })
      .map(([method]) => ({ ...args, method }));

    const greedy = options?.greedy;
    if (reqArgs.length > 1 && !greedy) {
      throw new Error(
        `Params passes multiple discriminators but multiple methods not allowed (greedy is false). Please check corresponsing methods: ${reqArgs.map(
          ({ method }) => method
        )}`
      );
    }
    return reqArgs;
  }

  let reqArgs: ReqArgs[];
  if (!Array.isArray(args)) {
    reqArgs = _getMethods(args);
  } else {
    reqArgs = args.map((_args) => _getMethods(_args)).flat();
  }
  if (reqArgs.length === 0) {
    throw NoMatchedMethodError;
  }
  return reqArgs;
}
