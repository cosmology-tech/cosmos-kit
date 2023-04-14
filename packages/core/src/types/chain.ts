import { Endpoints } from './manager';
import { Chain, AssetList } from '@chain-registry/types';
import { Namespace } from './wallet';

export type ChainName = string;

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
