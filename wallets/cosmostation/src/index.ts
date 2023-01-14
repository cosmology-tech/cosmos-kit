import {
  wallets as ext,
} from '@cosmos-kit/cosmostation-extension';
import { wallets as mobile } from '@cosmos-kit/cosmostation-mobile';

export const wallets = [...ext, ...mobile];
