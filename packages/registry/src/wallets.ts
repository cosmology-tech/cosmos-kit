import {
  KeplrWalletAdapter,
  KeplrWalletConnectAdapter,
} from '@cosmos-kit/keplr'

//stackoverflow.com/questions/42753968/type-checking-class-not-instance-of-class-extends-another-class
// https://stackoverflow.com/questions/43723313/typescript-abstract-class-static-method-not-enforced
// interface WalletAdapterConstructor<T extends WalletAdapter> {
//   new (): T
// }

// TODO how to represent the class itself, not an instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WalletAdapterType =
  | typeof KeplrWalletAdapter
  | typeof KeplrWalletConnectAdapter

export const WalletAdapters: WalletAdapterType[] = [
  KeplrWalletAdapter,
  KeplrWalletConnectAdapter,
]
