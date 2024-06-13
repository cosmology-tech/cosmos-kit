import { Chain } from '@chain-registry/types';
import { ClientNotExistError } from '@cosmos-kit/core';
import { v4 as uuidv4 } from 'uuid';

import { MockWallet } from '../../mocker'; // Ensure this path is correct
import { generateMnemonic, generateWallet } from '../../utils';
import { Mock } from './types';

interface MockWindow {
  mock?: Mock;
}

export type Wallet = {
  addressIndex: number;
  name: string;
  cipher: string;
  addresses: Record<string, string>;
  pubKeys: Record<string, Uint8Array>;
  walletType: string;
  id: string;
};

export const SITE = 'https://mock.mock';
export const ACTIVE_WALLET = 'ACTIVE_WALLET';
export const BETA_CW20_TOKENS = 'beta-cw20-tokens';

export const KeyChain = {
  storage: new Map(), // browser.local.storage
};

export const BrowserStorage = new Map();

let mockWalletInstance = null;

export const getMockFromExtension: (
  mockWindow?: MockWindow
) => Promise<MockWallet> = async (_window: any) => {
  if (!mockWalletInstance) throw ClientNotExistError;

  return mockWalletInstance;
};

async function initWallet(chains: Chain[]) {
  const addresses: Record<string, string> = {};
  const pubKeys: Record<string, Uint8Array> = {};

  const mnemonic = generateMnemonic();

  for (const chain of chains) {
    const { chain_id, bech32_prefix } = chain;
    const wallet = await generateWallet(mnemonic, { prefix: bech32_prefix });
    const accounts = await wallet.getAccounts();

    addresses[chain_id] = accounts[0].address;
    pubKeys[chain_id] = Buffer.from(accounts[0].pubkey);
  }

  const walletId = uuidv4() as string;

  const wallet: Wallet = {
    addressIndex: 0,
    name: `Wallet 0`,
    cipher: mnemonic, // cipher: encrypt(mnemonic, password),
    addresses,
    pubKeys,
    walletType: 'SEED_PHRASE',
    id: walletId,
  };

  KeyChain.storage.set('keystore', { [walletId]: wallet });
  KeyChain.storage.set(ACTIVE_WALLET, wallet);
}

export async function init(chains: Chain[]) {
  await initWallet(chains);

  mockWalletInstance = new MockWallet();
}
