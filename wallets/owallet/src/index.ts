import { wallets as ext } from '@cosmos-kit/owallet-extension';
import { wallets as mobile } from '@cosmos-kit/owallet-mobile';

export const wallets = [...ext, ...mobile];
