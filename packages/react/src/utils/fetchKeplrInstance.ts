export async function fetchKeplrInstance() {
  return import('@keplr-wallet/stores').then(({ getKeplrFromWindow }) =>
    getKeplrFromWindow()
  )
}
