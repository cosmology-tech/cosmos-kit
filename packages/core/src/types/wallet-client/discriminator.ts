import { Namespace } from './account';
import { WalletClientMethod } from './client';

export type RawMethod = string;

export type Discriminator =
  | boolean
  | ((params: unknown, options?: unknown) => boolean);

export type DiscriminatorMap = {
  [k in Namespace]?: {
    [k: RawMethod]: Discriminator;
  };
};

export type Discriminators = {
  [k in WalletClientMethod]?: DiscriminatorMap;
};
