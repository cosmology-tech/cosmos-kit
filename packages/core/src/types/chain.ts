import { Endpoints } from './manager';

export type ChainName = string;

export interface ChainRecord<Chain, AssetList> {
  name: ChainName;
  chain: Chain;
  assetList?: AssetList;
  clientOptions?: {
    [k: string]: any;
  };
  preferredEndpoints?: Endpoints;
}
