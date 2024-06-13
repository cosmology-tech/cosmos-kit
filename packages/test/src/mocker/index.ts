// @ts-nocheck
import { Chain } from '@chain-registry/types';
import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignature,
  StdSignDoc,
  encodeSecp256k1Signature,
  Secp256k1HdWallet,
} from '@cosmjs/amino';
import { sha256 } from '@cosmjs/crypto';
import { OfflineDirectSigner, OfflineSigner } from '@cosmjs/proto-signing';
import { DirectSignResponse, makeSignBytes } from '@cosmjs/proto-signing';
import { BroadcastMode } from '@cosmos-kit/core';
import type { ChainInfo } from '@keplr-wallet/types';
import * as bech32 from 'bech32';
import { chains } from 'chain-registry';
import Long from 'long';
import { Secp256k1, sha256 } from '@cosmjs/crypto';

import { Key, Mock, MockSignOptions } from '../mock-extension';
import { generateWallet, getADR36SignDoc, getChildKey } from '../utils';
import {
  KeyChain,
  BrowserStorage,
  SITE,
  ACTIVE_WALLET,
} from '../mock-extension/extension/utils';

export class MockWallet implements Mock {
  defaultOptions = {
    sign: {
      preferNoSetFee: false,
      preferNoSetMemo: false,
      disableBalanceCheck: false,
    },
  };

  mode = 'extension' as const;

  async disconnect(): Promise<void> {
    // Simulate disconnect logic
  }

  async enable(chainIds: string | string[]): Promise<void> {
    if (typeof chainIds === 'string') chainIds = [chainIds];

    const validChainIds = [];
    chainIds.forEach((chainId: string) => {
      const validChain = chains.find(
        (chain: Chain) => chain.chain_id === chainId
      );
      if (validChain) validChainIds.push(validChain.chain_id);
    });

    if (validChainIds.length === 0) {
      return { error: 'Invalid chain ids' };
    }

    const activeWallet = KeyChain.storage.get(ACTIVE_WALLET);

    let connections = BrowserStorage.get('connections');
    if (!connections) connections = {};
    if (!connections[activeWallet.id]) connections[activeWallet.id] = {};

    validChainIds.forEach((chainId) => {
      const enabledList = connections[activeWallet.id][chainId] || [];
      connections[activeWallet.id][chainId] = Array.from(
        new Set([...enabledList, SITE])
      );
    });

    BrowserStorage.set('connections', connections);

    return { success: 'Chain enabled' };
  }

  async suggestToken(chainId: string, contractAddress: string): Promise<void> {
    // Simulate suggesting a token
  }

  async suggestCW20Token(
    chainId: string,
    contractAddress: string
  ): Promise<void> {
    // Simulate suggesting a CW20 token
  }

  async getKey(chainId: string): Promise<Key> {
    const chainInfo = chains.find((chain) => chain.chain_id === chainId);

    if (!chainInfo || !chainInfo.status === 'live')
      throw new Error('Invalid chainId');

    const activeWallet = KeyChain.storage.get(ACTIVE_WALLET);

    const pubKey = activeWallet.pubKeys?.[chainId] ?? '';

    const address = getAddressFromBech32(activeWallet.addresses[chainId] ?? '');

    return {
      name: activeWallet.name,
      algo: 'secp256k1',
      pubKey,
      address,
      bech32Address: activeWallet.addresses[chainId],
      isNanoLedger: false,
    };
  }

  async getOfflineSigner(
    chainId: string
  ): Promise<OfflineAminoSigner & OfflineDirectSigner> {
    return {
      // Implement Offline Signer logic as needed
    } as OfflineAminoSigner & OfflineDirectSigner;
  }

  async getOfflineSignerOnlyAmino(
    chainId: string
  ): Promise<OfflineAminoSigner> {
    return {
      // Implement Offline Amino Signer logic as needed
    } as OfflineAminoSigner;
  }

  async getOfflineSignerAuto(chainId: string): Promise<OfflineSigner> {
    return {
      // Implement Auto Signer logic as needed
    } as OfflineSigner;
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: MockSignOptions
  ): Promise<AminoSignResponse> {
    const activeWallet = KeyChain.storage.get(ACTIVE_WALLET);

    const wallet = await Secp256k1HdWallet.fromMnemonic(activeWallet.cipher, {
      prefix: 'archway',
    });

    const { signed, signature } = await wallet.signAmino(signer, signDoc);
    return { signed, signature };
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: {
      authInfoBytes?: Uint8Array | null;
      accountNumber?: Long | null;
      bodyBytes?: Uint8Array | null;
      chainId?: string | null;
    },
    signOptions?: MockSignOptions
  ): Promise<DirectSignResponse> {
    // or use DirectSecp256k1HdWallet - signDirect

    const key = await getSignerKey(chainId, signer);

    const hash = sha256(makeSignBytes(signDoc));
    const signature = await Secp256k1.createSignature(
      hash,
      new Uint8Array(key.privateKey)
    );

    const signatureBytes = new Uint8Array([
      ...signature.r(32),
      ...signature.s(32),
    ]);

    const stdSignature = encodeSecp256k1Signature(
      new Uint8Array(key.publicKey),
      signatureBytes
    );

    return {
      signed: signDoc,
      signature: stdSignature,
    };
  }

  async signArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array
  ): Promise<StdSignature> {
    data = Buffer.from(data).toString('base64');
    const signDoc = getADR36SignDoc(signer, data);

    const { signature } = await this.signAmino(chainId, signer, signDoc);

    return signature;
  }

  async getEnigmaPubKey(chainId: string): Promise<Uint8Array> {
    return new Uint8Array();
  }

  async getEnigmaTxEncryptionKey(
    chainId: string,
    nonce: Uint8Array
  ): Promise<Uint8Array> {
    return new Uint8Array();
  }

  async enigmaEncrypt(
    chainId: string,
    contractCodeHash: string,
    msg: object
  ): Promise<Uint8Array> {
    return new Uint8Array();
  }

  async enigmaDecrypt(
    chainId: string,
    ciphertext: Uint8Array,
    nonce: Uint8Array
  ): Promise<Uint8Array> {
    return new Uint8Array();
  }

  async sendTx(
    chainId: string,
    tx: Uint8Array,
    mode: BroadcastMode
  ): Promise<Uint8Array> {
    return new Uint8Array();
  }

  async experimentalSuggestChain(chainInfo: ChainInfo): Promise<void> {
    const activeWallet = KeyChain.storage.get(ACTIVE_WALLET);
    const newKeystoreEntries = await Promise.all(
      Object.entries(KeyChain.storage.get('keystore')).map(
        async ([walletId, walletInfo]) => {
          const wallet = await generateWallet(walletInfo.cipher, {
            prefix: chainInfo.bech32Config.bech32PrefixAccAddr,
          });

          const accounts = await wallet.getAccounts();

          const newWallet = {
            ...walletInfo,
            addresses: {
              ...walletInfo.addresses,
              [chainInfo.chainId]: accounts[0].address,
            },
            pubKeys: {
              ...walletInfo.pubKeys,
              [chainInfo.chainId]: Buffer.from(accounts[0].pubkey),
            },
          };

          return [walletId, newWallet];
        }
      )
    );

    const newKeystore = newKeystoreEntries.reduce((res, entry) => {
      res[entry[0]] = entry[1];
      return res;
    }, {});

    KeyChain.storage.set('keystore', newKeystore);
    KeyChain.storage.set(ACTIVE_WALLET, newKeystore[activeWallet.id]);

    return newKeystore;
  }
}

function getAddressFromBech32(bech32Address) {
  const decoded = bech32.decode(bech32Address);
  return new Uint8Array(bech32.fromWords(decoded.words));
}

async function getSignerKey(chainId, signer) {
  const activeWallet = KeyChain.storage.get(ACTIVE_WALLET);
  const activeAddress = activeWallet.addresses[chainId];

  if (signer !== activeAddress)
    throw new Error('Signer address does not match wallet address');

  const mnemonic = activeWallet.cipher; // decrypt
  const hdPath = `m/44'/${118}'/${0}'/${0}/${0}`;

  return getChildKey(mnemonic, hdPath);
}
