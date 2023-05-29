import {
  EncodedString,
  TypedArrayType,
  TypeName,
  DiscriminatorMap,
  Args,
  ReqArgs,
  Options,
  Discriminator,
  ChainRecord,
  KeyToType,
} from '../types';
import { NoMatchedMethodError } from './error';
import { Logger } from './logger';

export function hasRequiredKeyType(arg: any, key2type: KeyToType): boolean {
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

export function hasOptionalKeyType(arg: any, key2type: KeyToType): boolean {
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
  itemType?: TypeName | TypedArrayType | KeyToType
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
        hasRequiredKeyType(arg[0], itemType as KeyToType)
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

export function isEncodedString(params: unknown): params is EncodedString {
  return hasRequiredKeyType(params, { value: 'string' });
}

export const isGreedy: Discriminator = (params: unknown, options?: Options) => {
  return Boolean(options?.allowMultipleRequests);
};

export function isChainRecord(
  params: unknown,
  options?: Options
): params is ChainRecord {
  if (
    typeof params?.['assetList'] !== 'undefined' &&
    !isArray(params?.['assetList']?.['assets'], {
      base: 'string',
      name: 'string',
      display: 'string',
      symbol: 'string',
    })
  ) {
    return false;
  }
  return (
    hasRequiredKeyType(params, { name: 'string', namespace: 'string' }) &&
    hasRequiredKeyType(params?.['chain'], {
      chain_name: 'string',
      status: 'string',
      network_type: 'string',
      pretty_name: 'string',
      chain_id: 'string',
    })
  );
}

export function getRequestArgsList(
  discriminatorMap: DiscriminatorMap | undefined,
  args: Args.General | Args.General[],
  logger?: Logger
): ReqArgs[] {
  if (!discriminatorMap) {
    throw NoMatchedMethodError;
  }

  function _getRequestArgsList(args: Args.General) {
    const { namespace, params, options } = args;
    const methods = options?.methods;
    if (typeof methods !== 'undefined') {
      return methods.map((method) => ({ ...args, method }));
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

    if (!options?.allowMultipleRequests && reqArgs.length > 1) {
      logger?.warn(
        "Multiple methods fits the args but you don't allow multiple requests in options. We'll only choose the first method for requesting."
      );
      return [reqArgs[0]];
    }
    return reqArgs;
  }

  let reqArgs: ReqArgs[];
  if (!Array.isArray(args)) {
    reqArgs = _getRequestArgsList(args);
  } else {
    reqArgs = args.map((_args) => _getRequestArgsList(_args)).flat();
  }
  if (reqArgs.length === 0) {
    throw NoMatchedMethodError;
  }
  return reqArgs;
}
