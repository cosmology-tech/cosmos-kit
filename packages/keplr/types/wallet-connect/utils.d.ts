import { BroadcastMode } from '@cosmjs/launchpad';
export declare function sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
