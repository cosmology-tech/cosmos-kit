export function checkInit(target: unknown, targetName?: string, msg?: string) {
  if (target === undefined || target === null) {
    throw new Error(msg || `${targetName || 'Variable'} is not inited!`);
  }
}

export function checkKey(
  target: Map<unknown, unknown>,
  key: string,
  targetName?: string,
  msg?: string
) {
  if (!target.has(key)) {
    throw new Error(msg || `${key} not existed in Map ${targetName}!`);
  }
}
