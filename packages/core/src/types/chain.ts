import { Endpoints } from './manager';
import { Chain, AssetList } from '@chain-registry/types';
import { Namespace } from './wallet-client';

export type ChainName = string;
export type ChainId = string;

export interface ChainRecord {
  name: ChainName;
  chain: Chain;
  namespace: Namespace;
  assetList?: AssetList;
  clientOptions?: {
    [k: string]: any;
  };
  preferredEndpoints?: Endpoints;
}
