import { Chain } from '@chain-registry/types';
import { StdSignDoc } from '@cosmjs/amino';
import { Bip39, Random, stringToPath } from '@cosmjs/crypto';
import { toBase64 } from '@cosmjs/encoding';
import {
  DirectSecp256k1HdWallet,
  DirectSecp256k1HdWalletOptions,
} from '@cosmjs/proto-signing';
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import { chains } from 'chain-registry';
import { v4 as uuidv4 } from 'uuid';

export type TWallet = {
  addressIndex: number;
  name: string;
  cipher: string; // mnemonic, should be encrypted in real environment.
  addresses: Record<string, string>;
  pubKeys: Record<string, Uint8Array>;
  walletType: string;
  id: string;
};

// website mock
export const ORIGIN = 'https://mock.mock';

export const KEYSTORE = 'keystore';
export const ACTIVE_WALLET = 'active-wallet';
type TKeyChainMapKey = 'keystore' | 'active-wallet';
export const KeyChain = {
  storage: new Map<TKeyChainMapKey, any>(),
};

export const CONNECTIONS = 'connections';
export const BETA_CW20_TOKENS = 'beta-cw20-tokens';
type TBrowserStorageMapKey = 'connections' | 'beta-cw20-tokens';
export const BrowserStorage = new Map<TBrowserStorageMapKey, any>();

export function getHdPath(
  coinType = '118',
  addrIndex = '0',
  account = '0',
  chain = '0'
): string {
  return `m/44'/${coinType}'/${account}'/${chain}/${addrIndex}`;
}

export function generateMnemonic(): string {
  return Bip39.encode(Random.getBytes(16)).toString();
}

export async function generateWallet(
  mnemonic: string,
  options?: Partial<DirectSecp256k1HdWalletOptions>
) {
  return DirectSecp256k1HdWallet.fromMnemonic(mnemonic, options);
}

export async function initActiveWallet(chains: Chain[]) {
  const addresses: Record<string, string> = {};
  const pubKeys: Record<string, Uint8Array> = {};

  const mnemonic = generateMnemonic();

  for (const chain of chains) {
    const { chain_id, bech32_prefix, slip44 } = chain;
    const options: Partial<DirectSecp256k1HdWalletOptions> = {
      prefix: bech32_prefix,
      hdPaths: [stringToPath(getHdPath(`${slip44}`))],
    };
    const wallet = await generateWallet(mnemonic, options);
    const accounts = await wallet.getAccounts();

    addresses[chain_id] = accounts[0].address;
    pubKeys[chain_id] = Buffer.from(accounts[0].pubkey);
  }

  const walletId = uuidv4() as string;

  const wallet: TWallet = {
    addressIndex: 0,
    name: `Wallet 0`,
    cipher: mnemonic, // cipher: encrypt(mnemonic, password),
    addresses,
    pubKeys,
    walletType: 'SEED_PHRASE',
    id: walletId,
  };

  KeyChain.storage.set(KEYSTORE, { [walletId]: wallet });
  KeyChain.storage.set(ACTIVE_WALLET, wallet);
}

export function getChainInfoByChainId(chainId: string): Chain {
  return chains.find((chain) => chain.chain_id === chainId);
}

export function getChildKey(chainId: string, address: string) {
  const activeWallet: TWallet = KeyChain.storage.get(ACTIVE_WALLET);
  const activeAddress = activeWallet.addresses[chainId];

  if (address !== activeAddress) {
    throw new Error('Signer address does not match wallet address');
  }

  const mnemonic = activeWallet.cipher; // decrypt
  const chainInfo = getChainInfoByChainId(chainId);
  const hdPath = getHdPath(
    chainInfo.slip44 + '',
    activeWallet.addressIndex + ''
  );

  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const node = bip32.fromSeed(seed);

  return node.derivePath(hdPath);
}

export function getADR36SignDoc(signer: string, data: string): StdSignDoc {
  return {
    chain_id: '',
    account_number: '1',
    sequence: '0',
    fee: { gas: '1000', amount: [] },
    msgs: [{ type: 'sign/MsgSignData', value: { signer, data } }],
    memo: '',
  };
}

export async function getContractInfo(
  chainId: string,
  contractAddress: string
) {
  const chainInfo = getChainInfoByChainId(chainId);
  const queryBytesStr = toBase64(Buffer.from('{"token_info":{}}'));
  const chainRest = chainInfo.apis.rest[0].address;
  const url = `${chainRest}/cosmwasm/wasm/v1/contract/${contractAddress}/smart/${queryBytesStr}`;

  const res = await fetch(url);
  return res.json();
}
