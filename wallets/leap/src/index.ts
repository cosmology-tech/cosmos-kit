import { wallets as ext } from '@cosmos-kit/leap-extension';
import { wallets as mobile } from '@cosmos-kit/leap-mobile';

export const wallets = [...ext, ...mobile];
