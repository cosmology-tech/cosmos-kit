import {
  wallets as ext,
} from '@cosmos-kit/keplr-extension';
import { wallets as mobile } from '@cosmos-kit/keplr-mobile';

export const wallets = [...ext, ...mobile];
