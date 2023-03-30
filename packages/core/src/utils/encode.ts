export function getStringFromUint8Array(
  array: Uint8Array,
  encoding: BufferEncoding = 'hex'
) {
  return Buffer.from(array).toString(encoding);
}

export function getUint8ArrayFromString(
  str: string,
  encoding: BufferEncoding = 'hex'
) {
  return new Uint8Array(Buffer.from(str, encoding));
}
