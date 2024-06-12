// @ts-nocheck
import { Chain } from '@chain-registry/types';
import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignature,
  StdSignDoc,
} from '@cosmjs/amino';
import { sha256 } from '@cosmjs/crypto';
import { OfflineDirectSigner, OfflineSigner } from '@cosmjs/proto-signing';
import { DirectSignResponse } from '@cosmjs/proto-signing';
import { BroadcastMode } from '@cosmos-kit/core';
import type { ChainInfo } from '@keplr-wallet/types';
import * as bech32 from 'bech32';
import { chains } from 'chain-registry';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import Long from 'long';
import * as secp256k1 from '@noble/secp256k1';

import { Key, Mock, MockSignOptions } from '../mock-extension';
import { generateWallet, getChildKey } from '../utils';
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
    return {
      signed: signDoc,
      signature: new Uint8Array(),
    };
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
    const key = getSignerKey(signer);

    const hash = sha256(serializeSignDoc(signDoc));
    const signature = await secp256k1.sign(hash, key.privateKey, {
      canonical: true,
      extraEntropy: signOptions?.extraEntropy === false ? undefined : true,
      der: false,
    });

    return {
      signed: signDoc,
      signature: signature,
    };
  }

  async signArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array
  ): Promise<StdSignature> {
    return {
      pubKey: new Uint8Array(),
      signature: new Uint8Array(),
    };
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

function serializeSignDoc(signDoc: SignDoc) {
  return SignDoc.encode(
    SignDoc.fromPartial({
      accountNumber: signDoc.accountNumber,
      authInfoBytes: signDoc.authInfoBytes,
      bodyBytes: signDoc.bodyBytes,
      chainId: signDoc.chainId,
    })
  ).finish();
}

function getSignerKey(signer) {
  const activeAddress = activeWallet.addresses[chainInfo.chain_id];
  if (signer !== activeAddress)
    throw new Error('Signer address does not match wallet address');

  const activeWallet = KeyChain.storage.get(ACTIVE_WALLET);
  const mnemonic = activeWallet.cipher; // decrypt
  const hdPath = `m/44'/${118}'/${0}'/${0}/${0}`;

  return getChildKey(mnemonic, hdPath);
}
