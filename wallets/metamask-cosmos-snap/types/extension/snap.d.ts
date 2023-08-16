import { AminoSignResponse, StdSignDoc } from '@cosmjs/amino';
import { GetSnapsResponse, Key, Snap } from './types';
import Long from 'long';
import { MetaMaskInpageProvider } from '@metamask/providers';
export declare const SnapOrigin = "npm:@leapwallet/metamask-cosmos-snap";
declare global {
    interface Window {
        ethereum?: MetaMaskInpageProvider;
    }
}
/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export declare const getSnaps: () => Promise<GetSnapsResponse>;
/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export declare const connectSnap: (snapId?: string, params?: Record<'version' | string, unknown>) => Promise<void>;
/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export declare const getSnap: (version?: string) => Promise<Snap | undefined>;
export declare const requestSignDirect: (chainId: string, signerAddress: string, signDoc: {
    bodyBytes?: Uint8Array | null;
    authInfoBytes?: Uint8Array | null;
    chainId?: string | null;
    accountNumber?: Long | null;
}) => Promise<{
    signature: import("@cosmjs/amino").StdSignature;
    signed: {
        accountNumber: string;
        authInfoBytes: Uint8Array;
        bodyBytes: Uint8Array;
        chainId: string;
    };
}>;
export declare const requestSignAmino: (chainId: string, signerAddress: string, signDoc: StdSignDoc) => Promise<AminoSignResponse>;
export declare const getKey: (chainId: string) => Promise<Key>;
export declare const isLocalSnap: (snapId: string) => boolean;
