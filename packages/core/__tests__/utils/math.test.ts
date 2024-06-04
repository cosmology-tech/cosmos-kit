import { sum } from '../../src/utils';

describe('sum Tests', () => {
  it('sum should return the correct sum of numbers', () => {
    const numbers = [1, 2, 3, 4, 5];
    const callbackFn = (previousValue, currentValue) => previousValue + currentValue;

    const result = sum(numbers, callbackFn, 0); // Initial value of 0

    expect(result).toBe(15);
  });

  it('sum should return initialValue for an empty iterable', () => {
    const emptyArray: number[] = [];
    const callbackFn = (previousValue, currentValue) => previousValue + currentValue;

    const result = sum(emptyArray, callbackFn, 10); // Initial value of 10

    expect(result).toBe(10);
  });

  it('sum should handle callback function with initial value', () => {
    const numbers = [1, 2, 3, 4, 5];
    const callbackFn = (previousValue, currentValue) => previousValue + currentValue;

    const result = sum(numbers, callbackFn, 10); // Initial value of 10

    expect(result).toBe(25); // Sum of numbers (1 + 2 + 3 + 4 + 5) + initial value (10)
  });
});
