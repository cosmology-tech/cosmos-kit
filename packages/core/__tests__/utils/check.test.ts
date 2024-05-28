import { checkInit, checkKey } from '../../src/utils/check';

describe('checkInit', () => {
  it('should throw an error if target is undefined', () => {
    expect(() => {
      checkInit(undefined);
    }).toThrowError('Variable is not inited!');
  });

  it('should throw an error if target is null', () => {
    expect(() => {
      checkInit(null);
    }).toThrowError('Variable is not inited!');
  });

  it('should throw a custom error message if provided', () => {
    expect(() => {
      checkInit(undefined, 'myTarget', 'Custom error message');
    }).toThrowError('Custom error message');
  });
});

describe('checkKey', () => {
  it('should throw an error if key does not exist in the target Map', () => {
    const target = new Map();
    expect(() => {
      checkKey(target, 'myKey', 'myMap');
    }).toThrowError('myKey not existed in Map myMap!');
  });

  it('should throw a custom error message if provided', () => {
    const target = new Map();
    expect(() => {
      checkKey(target, 'myKey', 'myMap', 'Custom error message');
    }).toThrowError('Custom error message');
  });
});
