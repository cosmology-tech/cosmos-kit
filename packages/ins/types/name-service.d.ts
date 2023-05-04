import { Chains } from '@chain-registry/types';
export declare type NameServiceName = string;
export interface NameServiceInfo {
    name: NameServiceName;
    contract: string;
    chainName: string;
    getNameQueryMsg: (address: string) => any;
    getAddressQueryMsg: (name: string, bech32_prefix?: string) => any;
    normalizeAddressResponse: (response: any) => string;
    normalizeNameResponse: (response: any) => string;
    slip173: string;
}
export declare type NameServiceRegistry = NameServiceInfo[];
export declare type ParsedInsName = {
    name: string;
    resolver: string;
    nameservice: string;
} | undefined;
/**
 * Parse a name into its components.
 *
 * The format is [name]@[chain_prefix].[resolver], similar to an email address.
 * For example, `meow@juno.sns` would resolve a Juno address using the Stargaze
 *
 * @param {String} name A fully compliant INS name.
 * @returns {ParsedInsName} The parsed name.
 **/
export declare const parseINSName: (name: string) => ParsedInsName;
/**
 * This class is used to resolve names and addresses accross the Interchain Name System.
 *
 * @Module INS
 */
export declare class INS {
    chains: Chains;
    ins_registry: NameServiceRegistry;
    /**
     * This class is used to resolve names and addresses.
     */
    constructor(chains: Chains, ins_registry: NameServiceRegistry);
    /**
     * Resolve a name to an address using a specific nameservice.
     *
     * @param {string} address The address to resolve a name for.
     */
    resolveInsName(address: string, nameservice: string): Promise<string | undefined>;
    /**
     * Resolve a full INS name to an address.
     *
     * The format is [name]@[chain_prefix].[resolver], similar to an email address.
     * For example, `jake@juno.sns` would resolve the address using the Stargaze
     *
     * @param {String} name A fully compliant INS name.
     **/
    resolveINSAddress(insName: string): Promise<string | undefined>;
}
