import { wallets as ext } from '@cosmos-kit/leap-extension';
import { wallets as mobile } from '@cosmos-kit/leap-mobile';
import { wallets as snap } from '@cosmos-kit/leap-metamask-cosmos-snap';

export const wallets = [...ext, ...mobile, ...snap];
