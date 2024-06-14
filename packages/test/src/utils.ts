import { Bip39, Random } from '@cosmjs/crypto';
import {
  DirectSecp256k1HdWallet,
  DirectSecp256k1HdWalletOptions,
} from '@cosmjs/proto-signing';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import { StdSignDoc } from '@cosmjs/amino';
import { chains } from 'chain-registry';
import { Chain } from '@chain-registry/types';

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

export function getChainInfoByChainId(chainId: string): Chain {
  const chainInfo = chains.find((chain) => chain.chain_id === chainId);
  return chainInfo;
}

export function getChildKey(mnemonic: string, HdPath: string) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const node = bip32.fromSeed(seed);
  return node.derivePath(HdPath);
}

export function getADR36SignDoc(signer: string, data: string): StdSignDoc {
  return {
    chain_id: '',
    account_number: '0',
    sequence: '0',
    fee: { gas: '0', amount: [] },
    msgs: [{ type: 'sign/MsgSignData', value: { signer, data } }],
    memo: '',
  };
}
