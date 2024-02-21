import { MainWalletBase } from '@cosmos-kit/core';

import { TailwindExtensionWallet } from '.';
import { tailwind_extension_info } from './constants';

export const wallets: MainWalletBase[] = [
  new TailwindExtensionWallet(tailwind_extension_info),
];
