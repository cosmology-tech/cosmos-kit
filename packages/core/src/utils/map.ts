export function valuesApply<K, V, R>(
  target: Map<K, V>,
  callbackfn: (value: V) => R
) {
  return new Map(
    Array.from(target).map(([key, value]) => [key, callbackfn(value)])
  );
}
