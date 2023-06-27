import { Keplr } from '@keplr-wallet/types';

declare const getKeplrFromExtension: () => Promise<Keplr | undefined>;

export { getKeplrFromExtension };
