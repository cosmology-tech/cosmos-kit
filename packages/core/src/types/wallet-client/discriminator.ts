import { Namespace } from './account';
import { Options } from './args';
import { WalletClientMethod } from './client';

export type RawMethod = string;

export type Discriminator =
  | boolean
  | ((params: unknown, options?: Options) => boolean);

export type DiscriminatorMap = {
  [k in Namespace]?: {
    [k: RawMethod]: Discriminator;
  };
};

export type Discriminators = {
  [k in WalletClientMethod]?: DiscriminatorMap;
};
