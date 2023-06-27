import { Keplr } from '@keplr-wallet/types';

declare type Coin98 = Omit<Keplr, 'experimentalSignEIP712CosmosTx_v0'>;

export { Coin98 };
