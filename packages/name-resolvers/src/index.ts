import * as stargaze from './stargaze';

export function defaultNameResolver(address: string) {
  return stargaze.resolveName(address);
}
