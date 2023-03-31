import { Endpoints } from './manager';

export type ChainName = string;

export interface ChainRecord {
  name: ChainName;
  chain: any;
  assetList?: any;
  clientOptions?: {
    [k: string]: any;
  };
  preferredEndpoints?: Endpoints;
}
