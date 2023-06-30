import Cosmos from "@ledgerhq/hw-app-cosmos";
export declare type TransportType = 'WebUSB' | 'WebHID';
export declare function getCosmosApp(type?: TransportType): Promise<Cosmos>;
export declare function getCosmosPath(accountIndex?: number): string;
export declare const ChainIdToBech32Prefix: {
    [k: string]: string;
};
