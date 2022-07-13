import fun from '../src';
import cases from 'jest-in-case';

cases(
  'first test',
  options => {
    fun(options);
  },
  [{ name: 'strings' }, { name: 'booleans' }, { name: 'noUnderscores' }]
);
