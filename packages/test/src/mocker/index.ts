// @ts-nocheckk
import { Chain } from '@chain-registry/types';
import {
  AminoSignResponse,
  encodeSecp256k1Signature,
  OfflineAminoSigner,
  Secp256k1HdWallet,
  StdSignature,
  StdSignDoc,
} from '@cosmjs/amino';
import { Secp256k1, sha256, stringToPath } from '@cosmjs/crypto';
import {
  DirectSignResponse,
  makeSignBytes,
  OfflineDirectSigner,
  OfflineSigner,
} from '@cosmjs/proto-signing';
import { BroadcastMode } from '@cosmos-kit/core';
import type { ChainInfo } from '@keplr-wallet/types';
import * as bech32 from 'bech32';
import type { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import deepmerge from 'deepmerge';

import { Key, Mock, MockSignOptions } from '../mock-extension';
import {
  ACTIVE_WALLET,
  BrowserStorage,
  KeyChain,
  SITE,
  Wallet,
} from '../mock-extension/extension/utils';
import {
  generateWallet,
  getADR36SignDoc,
  getChainInfoByChainId,
  getChildKey,
  getHdPath,
} from '../utils';
import {
  CosmJSOfflineSigner,
  CosmJSOfflineSignerOnlyAmino,
} from './offline-signer';

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
      const validChain = getChainInfoByChainId(chainId);
      if (validChain) validChainIds.push(validChain.chain_id);
    });

    if (validChainIds.length === 0) {
      // return { error: 'Invalid chain ids' };
      return;
    }

    const activeWallet: Wallet = KeyChain.storage.get(ACTIVE_WALLET);

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

    // return { success: 'Chain enabled' };
    return;
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
    const chainInfo: Chain = getChainInfoByChainId(chainId);

    if (!chainInfo || !(chainInfo.status === 'live'))
      throw new Error('Invalid chainId');

    const activeWallet: Wallet = KeyChain.storage.get(ACTIVE_WALLET);

    const pubKey = activeWallet.pubKeys?.[chainId];

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

  getOfflineSigner(
    chainId: string,
    signOptions?: MockSignOptions
  ): OfflineAminoSigner & OfflineDirectSigner {
    return new CosmJSOfflineSigner(
      chainId,
      this,
      deepmerge(this.defaultOptions ?? {}, signOptions ?? {})
    );
  }

  getOfflineSignerOnlyAmino(
    chainId: string,
    signOptions?: MockSignOptions
  ): OfflineAminoSigner {
    return new CosmJSOfflineSignerOnlyAmino(
      chainId,
      this,
      deepmerge(this.defaultOptions ?? {}, signOptions ?? {})
    );
  }

  async getOfflineSignerAuto(
    chainId: string,
    signOptions?: MockSignOptions
  ): Promise<OfflineSigner> {
    const _signOpts = deepmerge(this.defaultOptions ?? {}, signOptions ?? {});
    return new CosmJSOfflineSigner(chainId, this, _signOpts);
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: MockSignOptions
  ): Promise<AminoSignResponse> {
    const activeWallet: Wallet = KeyChain.storage.get(ACTIVE_WALLET);

    const chainInfo: Chain = getChainInfoByChainId(chainId);

    const hdPath = stringToPath(
      getHdPath(chainInfo.slip44 + '', activeWallet.addressIndex + '')
    );
    const wallet = await Secp256k1HdWallet.fromMnemonic(activeWallet.cipher, {
      prefix: chainInfo.bech32_prefix,
      hdPaths: [hdPath],
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
    // Or use DirectSecp256k1HdWallet - signDirect

    const key = getSignerKey(chainId, signer);

    const _signDoc = <SignDoc>{
      ...signDoc,
      accountNumber: signDoc.accountNumber
        ? BigInt(signDoc.accountNumber.toString())
        : null,
    };
    const hash = sha256(makeSignBytes(_signDoc));
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
      signed: _signDoc,
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
    const activeWallet: Wallet = KeyChain.storage.get(ACTIVE_WALLET);
    const newKeystoreEntries = await Promise.all(
      Object.entries(KeyChain.storage.get('keystore')).map(
        async ([walletId, walletInfo]: [string, Wallet]) => {
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

    const newKeystore = newKeystoreEntries.reduce(
      (res, entry: [string, Wallet]) => (res[entry[0]] = entry[1]) && res,
      {}
    );

    KeyChain.storage.set('keystore', newKeystore);
    KeyChain.storage.set(ACTIVE_WALLET, newKeystore[activeWallet.id]);

    // return newKeystore;
  }
}

function getAddressFromBech32(bech32Address) {
  const decoded = bech32.decode(bech32Address);
  return new Uint8Array(bech32.fromWords(decoded.words));
}

function getSignerKey(chainId, signer) {
  const activeWallet: Wallet = KeyChain.storage.get(ACTIVE_WALLET);
  const activeAddress = activeWallet.addresses[chainId];

  if (signer !== activeAddress) {
    throw new Error('Signer address does not match wallet address');
  }

  const mnemonic = activeWallet.cipher; // decrypt
  const chainInfo = getChainInfoByChainId(chainId);
  const hdPath = getHdPath(
    chainInfo.slip44 + '',
    activeWallet.addressIndex + ''
  );

  return getChildKey(mnemonic, hdPath);
}
