export function isEthTransactionDoc(doc: unknown) {
  return Object.keys(doc).findIndex((k) => k === 'from') !== -1;
}
