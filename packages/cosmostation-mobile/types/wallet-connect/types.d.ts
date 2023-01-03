export interface CosmostationAccount {
    address: Uint8Array;
    algo: string;
    bech32Address: string;
    isNanoLedger: boolean;
    name: string;
    pubKey: Uint8Array;
}
