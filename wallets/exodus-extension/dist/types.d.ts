import { StdSignDoc, AminoSignResponse } from '@cosmjs/amino';
export { StdSignDoc } from '@cosmjs/amino';
import { DirectSignResponse, AccountData } from '@cosmjs/proto-signing';
export { AccountData, DirectSignResponse } from '@cosmjs/proto-signing';
import { DirectSignDoc, BroadcastMode } from '@cosmos-kit/core';
export { BroadcastMode, DirectSignDoc } from '@cosmos-kit/core';

declare type Chain = string;
interface ConnectionOptions {
    chainId: Chain;
}
declare type Account = AccountData & {
    publicKey: Uint8Array;
};
interface ExodusCosmosProvider {
    connect: (options: ConnectionOptions) => Promise<Account>;
    signTransaction: (transaction: DirectSignDoc) => Promise<DirectSignResponse>;
    signAminoTransaction: (aminoTransaction: StdSignDoc) => Promise<AminoSignResponse>;
    sendTx: (chainId: string, rawTx: Uint8Array, mode: BroadcastMode) => Promise<Uint8Array>;
}
interface Exodus {
    cosmos: ExodusCosmosProvider;
}
interface ExodusWindow {
    exodus: Exodus;
}

export { Exodus, ExodusCosmosProvider, ExodusWindow };
