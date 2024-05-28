export function sum<T>(
  iterable: Iterable<T>,
  callbackfn: (
    previousValue: T,
    currentValue: T,
    currentIndex: number,
    array: T[]
  ) => T,
  initialValue: T
) {
  return Array.from(iterable).reduce(callbackfn, initialValue);
}
