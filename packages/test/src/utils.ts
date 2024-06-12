import { Bip39, Random } from '@cosmjs/crypto';
import {
  DirectSecp256k1HdWallet,
  DirectSecp256k1HdWalletOptions,
} from '@cosmjs/proto-signing';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';

export function getHDPath(
  coinType: '118' | '60',
  index = '0',
  account = '0',
  chain = '0'
) {
  return `m/44'/${coinType}'/${account}'/${chain}/${index}`;
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

export function getChildKey(mnemonic: string, HDPath: string) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const node = bip32.fromSeed(seed);
  return node.derivePath(HDPath);
}
