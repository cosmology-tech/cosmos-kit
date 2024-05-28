import { valuesApply } from '../../src/utils';

describe('valuesApply Tests', () => {
  it('valuesApply should apply callback function to all values in the map', () => {
    const originalMap = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3]
    ]);

    const callbackFn = (value) => value * 2;

    const resultMap = valuesApply(originalMap, callbackFn);

    expect(resultMap.get('a')).toBe(2);
    expect(resultMap.get('b')).toBe(4);
    expect(resultMap.get('c')).toBe(6);
  });

  it('valuesApply should return a new map', () => {
    const originalMap = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3]
    ]);

    const callbackFn = (value) => value * 2;

    const resultMap = valuesApply(originalMap, callbackFn);

    expect(resultMap).not.toBe(originalMap);
    expect(resultMap.size).toBe(originalMap.size);
  });

  it('valuesApply should handle empty map', () => {
    const originalMap = new Map();

    const callbackFn = (value) => value * 2;

    const resultMap = valuesApply(originalMap, callbackFn);

    expect(resultMap.size).toBe(0);
  });
});
