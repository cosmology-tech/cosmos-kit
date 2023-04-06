import { Endpoints } from './manager';
import { Chain, AssetList } from '@chain-registry/types';

export type ChainName = string;

export interface ChainRecord {
  name: ChainName;
  chain: Chain;
  assetList?: AssetList;
  clientOptions?: {
    [k: string]: any;
  };
  preferredEndpoints?: Endpoints;
}
