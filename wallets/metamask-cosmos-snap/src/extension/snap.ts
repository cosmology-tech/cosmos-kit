import { AminoSignResponse, StdSignDoc } from '@cosmjs/amino';
import { GetSnapsResponse, Key, Snap } from './types';
import Long from 'long';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { DirectSignResponse } from '@cosmjs/proto-signing';

export const SnapOrigin = `npm:@leapwallet/metamask-cosmos-snap`;

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

export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return ((await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown) as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = SnapOrigin,
  params: Record<'version' | string, unknown> = {}
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) => snap.id === SnapOrigin && (!version || snap.version === version)
    );
  } catch (e) {
    return undefined;
  }
};

export const requestSignDirect = async (
  chainId: string,
  signerAddress: string,
  signDoc: {
    bodyBytes?: Uint8Array | null;
    authInfoBytes?: Uint8Array | null;
    chainId?: string | null;
    accountNumber?: Long | null;
  }
) => {
  const signature = (await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: SnapOrigin,
      request: {
        method: 'signDirect',
        params: {
          chainId,
          signerAddress,
          signDoc,
        },
      },
    },
  })) as DirectSignResponse;

  const accountNumber = signDoc.accountNumber;
  const modifiedAccountNumber = new Long(
    accountNumber!.low,
    accountNumber!.high,
    accountNumber!.unsigned
  );

  return {
    signature: signature.signature,
    signed: {
      ...signature.signed,
      accountNumber: `${modifiedAccountNumber.toString()}`,
      authInfoBytes: new Uint8Array(
        Object.values(signature.signed.authInfoBytes)
      ),
      bodyBytes: new Uint8Array(Object.values(signature.signed.bodyBytes)),
    },
  };
};

export const requestSignAmino = async (
  chainId: string,
  signerAddress: string,
  signDoc: StdSignDoc
) => {
  const signResponse = (await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: SnapOrigin,
      request: {
        method: 'signAmino',
        params: {
          chainId,
          signerAddress,
          signDoc,
        },
      },
    },
  })) as AminoSignResponse;

  return signResponse;
};

export const getKey = async (chainId: string): Promise<Key> => {
  const accountData: any = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: SnapOrigin,
      request: {
        method: 'getKey',
        params: {
          chainId,
        },
      },
    },
  });

  if (!accountData) throw new Error('No account data found');
  (accountData as Key).pubKey = Uint8Array.from(
    Object.values(accountData.pubkey)
  );

  return accountData as Key;
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
