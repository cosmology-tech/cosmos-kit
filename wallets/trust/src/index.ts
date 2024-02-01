import { wallets as ext } from '@cosmos-kit/trust-extension';
import { wallets as mobile } from '@cosmos-kit/trust-mobile';

export const wallets = [...ext, ...mobile];
