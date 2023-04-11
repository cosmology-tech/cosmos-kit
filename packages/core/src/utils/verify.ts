import { EncodedString } from '../types';

export function isEncodedString(object: any): object is EncodedString {
  return (
    'value' in object &&
    typeof object['value'] === 'string' &&
    'encoding' in object &&
    typeof object['encoding'] === 'string'
  );
}
